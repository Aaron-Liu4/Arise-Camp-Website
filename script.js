document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("survivorRegistrationForm")
  const dependentsContainer = document.getElementById("dependents-container")
  const addDependentBtn = document.getElementById("add-dependent")
  let dependentCount = 0

  // Add dependent functionality
  addDependentBtn.addEventListener("click", () => {
    dependentCount++
    const dependentDiv = document.createElement("div")
    dependentDiv.className = "dependent-item"
    dependentDiv.innerHTML = `
            <div class="dependent-header">
                <span class="dependent-title">Dependent ${dependentCount}</span>
                <button type="button" class="remove-dependent" onclick="removeDependent(this)">✕</button>
            </div>
            <div class="dependent-fields">
                <div>
                    <label for="dependent-name-${dependentCount}">Name *</label>
                    <input type="text" id="dependent-name-${dependentCount}" name="dependents[${dependentCount}][name]" required>
                </div>
                <div>
                    <label>Age Group *</label>
                    <div class="age-group-options">
                        <input type="radio" id="dependent-adult-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="Adult" required>
                        <label for="dependent-adult-${dependentCount}">Adult</label>
                        
                        <input type="radio" id="dependent-university-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="University/Concession" required>
                        <label for="dependent-university-${dependentCount}">University/Concession</label>
                        
                        <input type="radio" id="dependent-youth-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="High School" required>
                        <label for="dependent-youth-${dependentCount}">High School</label>
                        
                        <input type="radio" id="dependent-primary-school-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="Primary School" required>
                        <label for="dependent-primary-school-${dependentCount}">Primary School</label>
                        
                        <input type="radio" id="dependent-preschool-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="Preschool (3-5 yrs)" required>
                        <label for="dependent-preschool-${dependentCount}">Preschool (3-5 yrs)</label>
                    </div>
                </div>
                <div>
                    <label>Gender *</label>
                    <div class="gender-options">
                        <input type="radio" id="dependent-male-${dependentCount}" name="dependents[${dependentCount}][gender]" value="male" required>
                        <label for="dependent-male-${dependentCount}">Male</label>
                        
                        <input type="radio" id="dependent-female-${dependentCount}" name="dependents[${dependentCount}][gender]" value="female" required>
                        <label for="dependent-female-${dependentCount}">Female</label>
                    </div>
                </div>
            </div>
        `
    dependentsContainer.appendChild(dependentDiv)
  })

  // Remove dependent functionality
  window.removeDependent = (button) => {
    button.closest(".dependent-item").remove()
  }

  // Form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault()

    // Basic form validation
    const fullName = document.getElementById("fullName").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const gender = document.querySelector('input[name="gender"]:checked')
    const address = document.getElementById("address").value
    const emergencyContact = document.getElementById("emergencyContact").value
    const ageGroup = document.querySelector('input[name="ageGroup"]:checked')
    const transport = document.querySelector('input[name="transport"]:checked')
    // Validation checks
    if (!fullName || !email || !phone || !address || !emergencyContact) {
      alert("Please fill in all required personal information fields!")
      return
    }

    if (!gender) {
      alert("Please select your gender!")
      return
    }

    if (!ageGroup) {
      alert("Please select your age group!")
      return
    }

    if (!transport) {
      alert("Please select your transport arrangement!")
      return
    }


    // Collect all form data
    const formData = new FormData(form)
    const data = {
        name: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        gender: formData.get("gender"),
        address: formData.get("address"),
        emergencyContact: formData.get("emergencyContact"),
        ageGroup: formData.get("ageGroup"),
        transport: formData.get("transport"),
        medicalInfo: formData.get("medicalInfo") || "",
        dependents: [],
    }

    // Collect dependents data
    const dependentItems = document.querySelectorAll(".dependent-item")
    dependentItems.forEach((item, index) => {
      const nameInput = item.querySelector(`input[name*="[name]"]`)
      const ageGroupInput = item.querySelector(`input[name*="[ageGroup]"]:checked`)
      const genderInput = item.querySelector(`input[name*="[gender]"]:checked`)

      if (nameInput && ageGroupInput && genderInput) {
        data.dependents.push({
          name: nameInput.value,
          ageGroup: ageGroupInput.value,
          gender: genderInput.value,
        })
      }
    })

    // // Send POST request
    console.log(data)
    fetch("https://nvb8wg8dmh.execute-api.ap-southeast-2.amazonaws.com/test/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result)
        alert(
          "Congratulations, Tribal Member! Your registration has been submitted successfully. Prepare for the ultimate adventure!",
        )
        form.reset()
        // Clear dependents
        dependentsContainer.innerHTML = ""
        dependentCount = 0
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("There was an error submitting your registration. Please try again.")
      })
  })
})
