(async function () {
    // Fetch employees from localStorage if available, otherwise load from the JSON data
    let storedEmployees = localStorage.getItem("employees");
    const res = storedEmployees
        ? JSON.parse(storedEmployees)
        : [
              {
                  id: 1001,
                  imageUrl: "gfg.png",
                  firstName: "Thomas",
                  lastName: "Leannon",
                  email: "Thomas.Leannon@gfg.com",
                  contactNumber: "4121091095",
                  age: 43,
                  dob: "26/08/1979",
                  salary: 1,
                  address: "Address1"
              },
              // Add the rest of your employee data here
          ];

    let employees = res;
    let selectedEmployeeId = employees.length > 0 ? employees[0].id : -1; // Default to -1 if empty
    let selectedEmployee = employees.length > 0 ? employees[0] : {};

    const employeeList = document.querySelector(".employees__names--list");
    const employeeInfo = document.querySelector(".employees__single--info");

    // Function to save employees to localStorage
    const saveEmployeesToStorage = () => {
        localStorage.setItem("employees", JSON.stringify(employees));
    };

    // Add Employee - START
    const createEmployee = document.querySelector(".createEmployee");
    const addEmployeeModal = document.querySelector(".addEmployee");
    const addEmployeeForm = document.querySelector(".addEmployee_create");

    createEmployee.addEventListener("click", () => {
        addEmployeeModal.style.display = "flex";
    });

    addEmployeeModal.addEventListener("click", (e) => {
        if (e.target.className === "addEmployee") {
            addEmployeeModal.style.display = "none";
        }
    });

    // Set Employee age to be entered minimum 18 years
    const dobInput = document.querySelector(".addEmployee_create--dob");
    dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`;

    addEmployeeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(addEmployeeForm);
        const values = [...formData.entries()];
        let empData = {};
        values.forEach((val) => {
            empData[val[0]] = val[1];
        });
        empData.id = employees.length > 0 ? employees[employees.length - 1].id + 1 : 1001; // Default to 1001 if empty
        empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);

        // Set default image URL if not provided
        empData.imageUrl = empData.imageUrl.trim() !== "" ? empData.imageUrl : "gfg.png"; // Replace with your actual default image URL

        employees.push(empData);
        renderEmployees();
        saveEmployeesToStorage(); // Save to localStorage
        addEmployeeForm.reset();
        addEmployeeModal.style.display = "none";
    });
    // Add Employee - END

    // Select Employee Logic - START
    employeeList.addEventListener("click", (e) => {
        if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
            selectedEmployeeId = e.target.id;
            renderEmployees();
            renderSingleEmployee();
        }
        // Employee Delete Logic - START
        if (e.target.tagName === "I") {
            employees = employees.filter((emp) => String(emp.id) !== e.target.parentNode.id);
            if (String(selectedEmployeeId) === e.target.parentNode.id) {
                selectedEmployeeId = employees.length > 0 ? employees[0].id : -1; // Default to -1 if empty
                selectedEmployee = employees.length > 0 ? employees[0] : {};
                renderSingleEmployee();
            }
            renderEmployees();
            saveEmployeesToStorage(); // Save updated list to localStorage
        }
        // Employee Delete Logic - END
    });
    // Select Employee Logic - END

    // Render All Employees Logic - START
    const renderEmployees = () => {
        employeeList.innerHTML = "";
        employees.forEach((emp) => {
            const employee = document.createElement("span");
            employee.classList.add("employees__names--item");
            if (parseInt(selectedEmployeeId, 10) === emp.id) {
                employee.classList.add("selected");
                selectedEmployee = emp;
            }
            employee.setAttribute("id", emp.id);
            employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">&#10060;</i>`;
            employeeList.append(employee);
        });
    };
    // Render All Employees Logic - END

    // Render Single Employee Logic - START
    const renderSingleEmployee = () => {
        if (selectedEmployeeId === -1) {
            employeeInfo.innerHTML = "";
            return;
        }
        employeeInfo.innerHTML = `
        <img src="${selectedEmployee.imageUrl}" alt="${selectedEmployee.firstName} ${selectedEmployee.lastName}" />
        <span class="employees__single--heading">
        ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
        </span>
        <span>${selectedEmployee.address}</span>
        <span>${selectedEmployee.email}</span>
        <span>Mobile - ${selectedEmployee.contactNumber}</span>
        <span>DOB - ${selectedEmployee.dob}</span>`;
    };
    // Render Single Employee Logic - END

    renderEmployees();
    if (selectedEmployee) renderSingleEmployee();
})();
