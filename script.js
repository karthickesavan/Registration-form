
const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const emptyMessage = document.getElementById("emptyMessage");
const message = document.getElementById("message");
const search = document.getElementById("search");

let students = [];

try {
    students = JSON.parse(
        localStorage.getItem("studentRecords") || "[]"
    );

    if (!Array.isArray(students)) {
        students = [];
    }
} catch {
    students = [];
}

function saveStudents() {
    try {
        localStorage.setItem(
            "studentRecords",
            JSON.stringify(students)
        );
        return true;
    } catch {
        message.textContent = "Unable to save records in this browser.";
        return false;
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const student = {
        id: crypto.randomUUID(),
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        rollNo: document.getElementById("rollNo").value.trim(),
        course: document.getElementById("course").value,
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        postal: document.getElementById("postal").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    if (!/^\d{10}$/.test(student.phone)) {
        message.style.color = "#b42335";
        message.textContent = "Enter a valid 10-digit contact number.";
        return;
    }

    const duplicate = students.some(item =>
        item.rollNo.toLowerCase() === student.rollNo.toLowerCase()
    );

    if (duplicate) {
        message.style.color = "#b42335";
        message.textContent = "This roll number is already registered.";
        return;
    }

    students.unshift(student);

    if (!saveStudents()) {
        students.shift();
        return;
    }

    renderStudents();
    form.reset();

    message.style.color = "#23764c";
    message.textContent = "Student registered successfully.";
});

function renderStudents() {
    const query = search.value.trim().toLowerCase();

    const filtered = students.filter(student =>
        [
            student.firstName,
            student.lastName,
            student.rollNo,
            student.course,
            student.phone,
            student.email
        ].some(value => value.toLowerCase().includes(query))
    );

    studentList.innerHTML = filtered.map(student => `
        <tr>
            <td>${escapeHTML(student.rollNo)}</td>
            <td>${escapeHTML(student.firstName)} ${escapeHTML(student.lastName)}</td>
            <td>${escapeHTML(student.course)}</td>
            <td>${escapeHTML(student.phone)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>
                <button class="action-btn delete"
                    data-id="${escapeHTML(student.id)}">Delete</button>
            </td>
        </tr>
    `).join("");

    emptyMessage.hidden = filtered.length > 0;
    emptyMessage.textContent = filtered.length
        ? ""
        : students.length
            ? "No matching students found."
            : "No students registered yet.";
}

studentList.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-id]");

    if (!button) return;

    const student = students.find(item => item.id === button.dataset.id);

    if (!student) return;

    if (confirm(`Delete ${student.firstName} ${student.lastName}?`)) {
        const previous = students;
        students = students.filter(item => item.id !== student.id);

        if (!saveStudents()) {
            students = previous;
        }

        renderStudents();
        message.textContent = "Student record deleted.";
    }
});

search.addEventListener("input", renderStudents);

form.addEventListener("reset", function() {
    message.textContent = "";
});

renderStudents();
