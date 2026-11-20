const nameInput = document.getElementById("nameInput");
const roleInput = document.getElementById("roleInput");
const aboutInput = document.getElementById("aboutInput");

const skillCategoryInput = document.getElementById("skillCategoryInput");
const skillInput = document.getElementById("skillInput");
const projectInput = document.getElementById("projectInput");
const projectDescriptionInput = document.getElementById("projectDescriptionInput");
const projectLinkInput = document.getElementById("projectLinkInput");

const previewName = document.getElementById("previewName");
const previewRole = document.getElementById("previewRole");
const previewAbout = document.getElementById("previewAbout");

const skillsList = document.getElementById("skillsList");
const projectsList = document.getElementById("projectsList");


let skills = JSON.parse(localStorage.getItem("skills")) || ["HTML", "CSS"];

skills = skills.map(function(skill) {
    return typeof skill === "string"
        ? { name: skill, category: "Other" }
        : skill;
});
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let editingProjectIndex = null;



function saveData() {
    localStorage.setItem("skills", JSON.stringify(skills));
    localStorage.setItem("projects", JSON.stringify(projects));

    localStorage.setItem("name", nameInput.value);
    localStorage.setItem("role", roleInput.value);
    localStorage.setItem("about", aboutInput.value);
}

function updatePortfolio() {
    previewName.textContent =
        nameInput.value.trim() || "Komal Kumari";

    previewRole.textContent =
        roleInput.value.trim() || "Web Development";

    previewAbout.textContent =
        aboutInput.value.trim() || "I am an aspiring Web Developer with a passion for creating modern, responsive, and user-friendly websites. I am learning HTML, CSS, and JavaScript and enjoy building practical projects to improve my coding skills. I am eager to learn new technologies, solve problems, and grow as a developer.";

    previewName.style.fontSize = "50px";
    previewRole.style.fontSize = "30px";
    previewAbout.style.fontSize = "20px";
    }

nameInput.addEventListener("input", function() {
    updatePortfolio();
    saveData();
});

roleInput.addEventListener("input", function() {
    updatePortfolio();
    saveData();
});

aboutInput.addEventListener("input", function() {
    updatePortfolio();
    saveData();
});

function loadProfile() {
    nameInput.value = localStorage.getItem("name") || ""; 
    roleInput.value = localStorage.getItem("role") || "";
    aboutInput.value = localStorage.getItem("about") || "";

    updatePortfolio();
}

document.getElementById("saveBtn").addEventListener("click", function() {
    updatePortfolio();
    saveData();
    updateSEO();
    document.getElementById("saveMessage").textContent =
        "Portfolio saved successfully!";
});

function updateSEO() {
    const name = document.getElementById("nameInput").value.trim();

    document.title = name
        ? name + " | My Portfolio"
        : "CodeFolio | My Portfolio";

    const description = document.querySelector(
        'meta[name="description"]'
    );

    if (description) {
        description.content = name
            ? "Explore " + name + "'s portfolio, skills, and projects."
            : "A professional portfolio showcasing skills and projects.";
    }
}


function renderSkills() {
    skillsList.replaceChildren();

     if (skills.length === 0) {
        const message = document.createElement("p");
        message.innerHTML = "<b>HTML<br>CSS<br>JavaScript</b>";
        skillsList.appendChild(message);
        return;
    }
    

    const categories = ["Frontend", "Backend", "Database", "Tools", "Other"];

    categories.forEach(function(category) {
        const categorySkills = skills.filter(function(skill) {
            return skill.category === category;
        });

        if (categorySkills.length === 0) return;

        const heading = document.createElement("h4");
        heading.textContent = category;
        skillsList.appendChild(heading);

        categorySkills.forEach(function(skill) {
            const tag = document.createElement("span");
            tag.className = "skill-tag";

            const skillName = document.createElement("span");
            skillName.textContent = skill.name;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "×";
            deleteBtn.type = "button";
            deleteBtn.className = "delete-skill-btn";

            deleteBtn.addEventListener("click", function() {
                if (!confirm("Are you sure you want to delete this skill?")) {
                    return;
                }

                skills = skills.filter(function(item) {
                    return item !== skill;
                });

                saveData();
                renderSkills();
            });

            tag.append(skillName, deleteBtn);
            skillsList.appendChild(tag);
        });
    });
}

document.getElementById("addSkillBtn").addEventListener("click", function() {
    const skill = skillInput.value.trim();

    if (skill === "") {
        alert("Please enter a skill!");
        return;
    }

    if (skills.some(item => item.name.toLowerCase() === skill.toLowerCase())) {
        alert("Ye skill pehle se added hai!");
        return;
    }

    skills.push({
        name: skill,
        category: skillCategoryInput.value
    });

    saveData();
    skillInput.value = "";
    renderSkills();
});


skillInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addSkillBtn").click();
    }
});


function renderProjects() {

    projectsList.replaceChildren();

    if (projects.length === 0) {
        const message = document.createElement("p");
        message.innerHTML = "<h3><b><u>Code Folio – Personal Portfolio Builder</u></b></h3><br><b>Code Folio is a personal portfolio builder created using HTML, CSS, and JavaScript. It allows users to customize their profile, upload a profile photo, add skills and projects, change themes, and download their portfolio as an HTML file.</b>";
        projectsList.appendChild(message);
        return;
    }

    
    projects.forEach(function(project, index) {
       
        const projectData = typeof project === "string"
            ? { name: project, description: "", link: "" }
            : project;

        const card = document.createElement("div");
        card.className = "project-card";

        const title = document.createElement("h4");
        title.textContent = projectData.name;

        const description = document.createElement("p");
        description.textContent = projectData.description || "No description added.";

        card.append(title, description);

        if (projectData.link) {
            const link = document.createElement("a");
            link.href = projectData.link;
            link.textContent = "View Project";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            card.appendChild(link);
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "🗑 Delete";
        deleteBtn.className = "delete-project-btn";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "✏️ Edit";
        editBtn.className = "edit-project-btn";

        editBtn.addEventListener("click", function() {
            projectInput.value = projectData.name || "";
            projectDescriptionInput.value = projectData.description || "";
            projectLinkInput.value = projectData.link || "";
        
            projectInput.focus();

            document.getElementById("addProjectBtn").textContent = "Update Project";
            editingProjectIndex = index;
        });

        deleteBtn.addEventListener("click", function() {
            const confirmed = confirm("Are you sure you want to delete this project?");

        if (!confirmed) {
            return;
        }
            projects.splice(index, 1);
            saveData();
            renderProjects();
        });

        const actions = document.createElement("div");
        actions.className = "project-actions";

        actions.append(editBtn, deleteBtn);
    
        card.appendChild(actions);
        projectsList.appendChild(card);
           });
    }



document.getElementById("addProjectBtn").addEventListener("click", function() {
    const project = projectInput.value.trim();
    const description = projectDescriptionInput.value.trim();
    const link = projectLinkInput.value.trim();

    if (project === "") {
        alert("Please enter a project name!");
        return;
    }

    if (link !== "" && !/^https?:\/\/.+/i.test(link)) {
    alert("Please enter a valid link starting with https:// or http://");
    return;
}

  
if (editingProjectIndex !== null) {
    
    projects[editingProjectIndex] = {
        name: project,
        description: description,
        link: link
    };

    editingProjectIndex = null;
    document.getElementById("addProjectBtn").textContent = "Add Project";
} else {
    
    projects.push({
        name: project,
        description: description,
        link: link
    });
}


    saveData();

    projectInput.value = "";
    projectDescriptionInput.value = "";
    projectLinkInput.value = "";

    renderProjects();
});



function autoSaveEditedProject() {
    if (editingProjectIndex === null) {
        return;
    }

    projects[editingProjectIndex] = {
        name: projectInput.value.trim(),
        description: projectDescriptionInput.value.trim(),
        link: projectLinkInput.value.trim()
    };

    saveData();
    renderProjects();
}

projectInput.addEventListener("input", autoSaveEditedProject);
projectDescriptionInput.addEventListener("input", autoSaveEditedProject);
projectLinkInput.addEventListener("input", autoSaveEditedProject);


projectInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addProjectBtn").click();
    }
});


renderSkills();
renderProjects();
loadProfile();


function escapeHTML(value) {
    const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        return characters[char];
    });
}

// Profile Photo URL
const photoUrlInput = document.getElementById("photoUrlInput");
const loadPhotoUrlBtn = document.getElementById("loadPhotoUrlBtn");

let linkedPhotoData = "";

if (loadPhotoUrlBtn) {
    loadPhotoUrlBtn.addEventListener("click", async function () {

        const photoUrl = photoUrlInput.value.trim();

        if (!photoUrl) {
            alert("Please paste your photo URL!");
            return;
        }

        try {
            const response = await fetch(photoUrl);

            if (!response.ok) {
                throw new Error("Photo could not load");
            }

            const blob = await response.blob();

            if (!blob.type.startsWith("image/")) {
                throw new Error("Link must point directly to an image");
            }

            const reader = new FileReader();

            reader.onload = function () {
                linkedPhotoData = reader.result;

                const previewPhoto =
                    document.getElementById("previewPhoto");

                previewPhoto.src = linkedPhotoData;
                previewPhoto.hidden = false;

                alert("Photo loaded successfully!");
            };

            reader.readAsDataURL(blob);

        } catch (error) {
            alert();
            console.error(error);
        }
    });
}

document.getElementById("downloadPortfolioBtn").addEventListener("click", async function () {
    const name = nameInput.value.trim() || "Komal Kumari";
    const role = roleInput.value.trim() || " Web Development";
    const about = aboutInput.value.trim() || "I am an aspiring Web Developer with a passion for creating modern, responsive, and user-friendly websites. I am learning HTML, CSS, and JavaScript and enjoy building practical projects to improve my coding skills. I am eager to learn new technologies, solve problems, and grow as a developer.";
    const profilePhoto = localStorage.getItem("profilePhoto") || linkedPhotoData || "";

    const photoHTML = profilePhoto
      ? `<img src="${profilePhoto}" alt="Profile Photo" class="download-photo">`
      : "";

    const themes = {
        purple: {
            primary: "#6c3bc5",
            secondary: "#eee5ff",
            text: "#30204b",
            card: "#ffffff",
            background: "#f8f5ff"
        },
        blue: {
            primary: "#1769aa",
            secondary: "#dceeff",
            text: "#17324d",
            card: "#ffffff",
            background: "#f0f7ff"
        },
        green: {
            primary: "#26734d",
            secondary: "#dcf5e7",
            text: "#183c2b",
            card: "#ffffff",
            background: "#f1faf4"
        },
        pink: {
            primary: "#c04479",
            secondary: "#ffe0ed",
            text: "#58243d",
            card: "#ffffff",
            background: "#fff4f8"
        },
        dark: {
            primary: "#a78bfa",
            secondary: "#30294a",
            text: "#f3f0ff",
            card: "#211d2e",
            background: "#15121e"
        }
    };

    const selectedTheme =
        localStorage.getItem("codefolioTheme") || "purple";

    const theme = themes[selectedTheme] || themes.purple;

   const categories = ["Frontend", "Backend", "Database", "Tools", "Other"];

const skillsHTML = categories.map(function(category) {
    const categorySkills = skills.filter(function(skill) {
        return skill.category === category;
    });

    if (categorySkills.length === 0) return "";

    return `
        <div class="skill-category">
            <h3>${escapeHTML(category)}</h3>
            ${categorySkills.map(function(skill) {
                return `<span class="skill">${escapeHTML(skill.name)}</span>`;
            }).join("")}
        </div>
    `;
}).join("");


    const projectsHTML = projects.map(function (project) {
        const data = typeof project === "string"
            ? { name: project, description: "", link: "" }
            : project;

        const safeName = escapeHTML(data.name || "Untitled Project");
        const safeDescription = escapeHTML(
            data.description || "No description added."
        );

        let projectLink = "";

        if (data.link && /^https?:\/\/.+/i.test(data.link)) {
            projectLink = `<p><a href="${escapeHTML(data.link)}"
                target="_blank" rel="noopener noreferrer">View Project</a></p>`;
        }

        return `
            <article class="project">
                <h3>${safeName}</h3>
                <p>${safeDescription}</p>
                ${projectLink}
            </article>
        `;
    }).join("");

    
const github = localStorage.getItem("github") || "";
const netlify = localStorage.getItem("netlify") || "";
const linkedin = localStorage.getItem("linkedin") || "";
const resume = localStorage.getItem("resume") || "";

function createSocialLink(url, label) {
    const safeUrl = url.trim();

    if (!safeUrl || !/^https?:\/\/.+/i.test(safeUrl)) {
        return "";
    }

    return `<p>
        <a href="${escapeHTML(safeUrl)}"
           target="_blank"
           rel="noopener noreferrer">${escapeHTML(label)}</a>
    </p>`;
}

const socialLinksHTML = [
    createSocialLink(github, "GitHub"),
    createSocialLink(netlify, "Live Portfolio"),
    createSocialLink(linkedin, "LinkedIn"),
    createSocialLink(resume, "Resume")
].join("");

// Resume section for downloaded portfolio
const resumeMatch = resume.match(/\/file\/d\/([^/]+)/);

const resumeHTML = resumeMatch
    ? `
        <section>
            <h2>My Resume</h2>

            <iframe
                src="https://drive.google.com/file/d/${resumeMatch[1]}/preview"
                width="100%"
                height="600"
                style="border: 1px solid #ccc; border-radius: 10px;"
                title="My Resume PDF">
            </iframe>

            <p>
                <a
                    href="https://drive.google.com/uc?export=download&id=${resumeMatch[1]}"
                    target="_blank"
                    rel="noopener noreferrer">
                    Download Resume
                </a>
            </p>
        </section>
    `
    : "";


    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(name)} | Portfolio</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 24px;
            font-family: Arial, sans-serif;
            background: ${theme.background};
            color: ${theme.text};
        }

       main {
    max-width: 900px;
    margin: 20px auto;
    padding: 24px;
    border: 4px solid ${theme.primary};
    border-radius: 22px;
    background: ${theme.background};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

        header, section {
            background: ${theme.card};
            color: ${theme.text};
            padding: 24px;
            margin-bottom: 20px;
            border-radius: 14px;
            overflow-wrap: anywhere;
        }

        header {
            background: ${theme.primary};
            color: #ffffff;
        }

        header h1, header h2, header p {
            color: #ffffff;
        }

        .skill {
            display: inline-block;
            margin: 5px;
            padding: 8px 12px;
            border-radius: 20px;
            background: ${theme.secondary};
            color: ${theme.text};
            border: 1px solid ${theme.primary};
        }

        .project {
            background: ${theme.secondary};
            color: ${theme.text};
            border: 1px solid ${theme.primary};
            border-radius: 10px;
            padding: 16px;
            margin: 12px 0;
        }

        .project h3, .project p {
            color: ${theme.text};
        }

        a {
            color: ${theme.primary};
            overflow-wrap: anywhere;
        }

        @media (max-width: 480px) {
            body {
                padding: 12px;
            }

            header, section {//
                padding: 16px;
            }
                main {
    padding: 12px;
    margin: 8px auto;
    border-width: 3px;
    border-radius: 16px;
}
        }
            .profile-heading {
    display: flex;
    align-items: center;
    gap: 20px;
}

.download-photo {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    flex-shrink: 0;
}

.profile-info {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
}
section {
    border: 2px solid ${theme.primary};
    border-radius: 14px;
    padding: 20px;
    margin: 20px 0;
    background: ${theme.card};
    color: ${theme.text};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.skill {
    display: inline-block;
    border: 1px solid ${theme.primary};
    border-radius: 8px;
    padding: 8px 12px;
    margin: 5px;
    background: ${theme.secondary};
    color: ${theme.text};
}

.project {
    border: 2px solid ${theme.primary};
    border-radius: 12px;
    padding: 16px;
    margin: 12px 0;
    background: ${theme.secondary};
    color: ${theme.text};
    overflow-wrap: anywhere;
}

    </style>
</head>

<body>
    <main>
        <header>
            <div class="profile-heading">
    ${photoHTML}
    <div class="profile-info">
        <h1>${escapeHTML(name)}</h1>
        <h2>${escapeHTML(role)}</h2>
        <p>${escapeHTML(about)}</p>
    </div>
</div>
        </header>

        <section>
            <h2>My Skills</h2>
            ${skillsHTML || "<p>HTML<br>CSS<br>JavaScript<br>MS Office<br>MS Word<br>MS Excel<br>MS PowerPoint</p>"}
            
        </section>

       
<section>
    <h2>My Projects</h2>
    ${projectsHTML || "<p><u><b>Code Folio – Personal Portfolio Builder</b></u><br><br> Code Folio is a personal portfolio builder created using HTML, CSS, and JavaScript. It allows users to customize their profile, upload a profile photo, add skills and projects, change themes, and download their portfolio as an HTML file.<br><a href=\"https://jovial-sopapillas-856b45.netlify.app/\" target=\"_blank\">Visit My Code Folio</a><br><br><u><b>MBA GameZone</b></u><br><br>An educational gaming website designed for MBA students and MBA entrance exam aspirants. It helps users learn through quizzes, management challenges, case studies, and business simulations.<br> <a href=\"https://fascinating-dolphin-69866b.netlify.app/\" target=\"_blank\">Visit My GameZone</a></p>"}
</section>

<section>
    <h2>Connect With Me</h2>
    ${socialLinksHTML || "<p>github:  <a href='https://github.com/Komal-Kumari-582' target='_blank'>Komal-Kumari-582</a><br>linkedin: <a href='https://www.linkedin.com/in/komal-kumari-7a6385354/' target='_blank'>Komal-Kumari-7a6385354/</a><br> <a href='https://drive.google.com/file/d/1niEZlOi2sMH58-E_CKgKChU_prYxsjox/view?usp=drive_link' target='_blank'>Download Resume</a> </p>"}
</section>

${resumeHTML}

</main>

    </main>
</body>
</html>`;

    const file = new Blob([html], {
        type: "text/html;charset=utf-8"
    });

    const fileURL = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");

    downloadLink.href = fileURL;
    downloadLink.download = "codefolio-portfolio.html";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    setTimeout(function () {
        URL.revokeObjectURL(fileURL);
    }, 1000);
});


/* CodeFolio Theme Selector */
const themeSelect = document.getElementById("themeSelect");

if (themeSelect) {
    const savedTheme = localStorage.getItem("codefolioTheme") || "purple";

    document.body.dataset.theme = savedTheme;
    themeSelect.value = savedTheme;

    themeSelect.addEventListener("change", function () {
        const selectedTheme = themeSelect.value;

        document.body.dataset.theme = selectedTheme;
        localStorage.setItem("codefolioTheme", selectedTheme);
    });
}

// Dashboard sidebar navigation
const sidebarButtons = document.querySelectorAll(".sidebar-btn");

sidebarButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const sectionName = button.dataset.section;
        const targetSection = document.getElementById(sectionName);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            sidebarButtons.forEach(function(btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");
        }
    });
});


 // Clear Profile button
const clearProfileBtn = document.getElementById("clearProfileBtn");

if (clearProfileBtn) {
    clearProfileBtn.addEventListener("click", function () {
        const confirmed = confirm(
            "Are you sure you want to clear your profile details?"
        );

        if (!confirmed) {
            return;
        }

        // Profile fields clear karo
        nameInput.value = "";
        roleInput.value = "";
        aboutInput.value = "";
       

        // Saved profile details remove karo
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        localStorage.removeItem("about");

        localStorage.removeItem("profilePhoto");


        // Clear saved skills and projects
skills = [];
projects = [];

localStorage.removeItem("skills");
localStorage.removeItem("projects");

// Clear social links / IDs
localStorage.removeItem("github");
localStorage.removeItem("netlify");
localStorage.removeItem("linkedin");
localStorage.removeItem("resume");

// Clear skill and project input fields
skillInput.value = "";
projectInput.value = "";
projectDescriptionInput.value = "";
projectLinkInput.value = "";

// Update the preview immediately
renderSkills();
renderProjects();


if (previewPhoto) {
    previewPhoto.removeAttribute("src");
    previewPhoto.hidden = true;
}

if (photoInput) {
    photoInput.value = "";
}
       
        // Preview update karo
        updatePortfolio();

        // Success message
        document.getElementById("saveMessage").textContent =
            "Profile cleared successfully!";
    });
}


/* Profile Photo Upload */
const photoInput = document.getElementById("photoInput");
const previewPhoto = document.getElementById("previewPhoto");
const removePhotoBtn = document.getElementById("removePhotoBtn");

if (photoInput && previewPhoto) {
    // Load previously saved photo
  const savedPhoto = localStorage.getItem("profilePhoto");

previewPhoto.src = savedPhoto || "C:\\Users\\arani\\OneDrive\\Documents\\Desktop\\Komal Internship\\Web Development\\codefolio\\Image\\profile.png";
previewPhoto.hidden = false;

    // Preview and save selected photo
    photoInput.addEventListener("change", function () {
        const file = photoInput.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            photoInput.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Please select a photo smaller than 2 MB.");
            photoInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function () {
            const photoData = reader.result;

            try {
                localStorage.setItem("profilePhoto", photoData);
                previewPhoto.src = photoData;
                previewPhoto.hidden = false;
            } catch (error) {
                alert("Photo could not be saved. Please choose a smaller image.");
            }
        };

        reader.readAsDataURL(file);
    });
}

// Remove selected profile photo
if (removePhotoBtn && previewPhoto) {
    removePhotoBtn.addEventListener("click", function () {
        localStorage.removeItem("profilePhoto");
        previewPhoto.removeAttribute("src");
        previewPhoto.hidden = true;

        if (photoInput) {
            photoInput.value = "";
        }
    });
}


 // Social Links and Resume
const githubInput = document.getElementById("githubInput");
const netlifyInput = document.getElementById("netlifyInput");
const linkedinInput = document.getElementById("linkedinInput");
const resumeInput = document.getElementById("resumeInput");

const socialLinks = document.querySelectorAll(".social-link");

// Load saved links
githubInput.value = localStorage.getItem("github") || "";
netlifyInput.value = localStorage.getItem("netlify") || "";
linkedinInput.value = localStorage.getItem("linkedin") || "";
resumeInput.value = localStorage.getItem("resume") || "";

// Update Connect With Me links
function updateSocialLinks() {
    socialLinks.forEach(function(link) {
        const type = link.dataset.link;
        const input = document.getElementById(
            type === "github" ? "githubInput" :
            type === "netlify" ? "netlifyInput" :
            "linkedinInput"
        );

        const url = input.value.trim();

        if (url) {
            link.href = url;
            link.hidden = false;
        } else {
            link.href = "#";
            link.hidden = false;
        }
    });
}

// Resume PDF Preview
const resumeSection = document.getElementById("resumeSection");
const resumePreview = document.getElementById("resumePreview");
const resumeDownloadBtn = document.getElementById("resumeDownloadBtn");

function updateResumeDisplay() {
    const resumeUrl = resumeInput.value.trim();

    if (resumeUrl) {
        const fileId = resumeUrl.match(/\/file\/d\/([^/]+)/);

        if (fileId) {
            const previewUrl =
                "https://drive.google.com/file/d/" +
                fileId[1] +
                "/preview";

            resumePreview.src = previewUrl;
            resumeDownloadBtn.href =
                "https://drive.google.com/uc?export=download&id=" +
                fileId[1];

            resumeSection.hidden = false;
        } else {
            resumeSection.hidden = true;
        }
    } else {
        resumeSection.hidden = true;
    }
}

resumeInput.addEventListener("input", updateResumeDisplay);

updateResumeDisplay();

// Save links when changed
[
    [githubInput, "github"],
    [netlifyInput, "netlify"],
    [linkedinInput, "linkedin"],
    [resumeInput, "resume"]
].forEach(function(item) {
    item[0].addEventListener("input", function() {
        localStorage.setItem(item[1], item[0].value.trim());
        updateSocialLinks();
    });
});

updateSocialLinks();

({
  screenWidth: document.documentElement.clientWidth,
  pageWidth: document.documentElement.scrollWidth,
  overflowing: [...document.querySelectorAll("body *")]
    .filter(el => el.getBoundingClientRect().right >
      document.documentElement.clientWidth + 1)
    .map(el => ({
      element: el.tagName,
      className: el.className,
      right: Math.round(el.getBoundingClientRect().right)
    }))
    .slice(0, 15)
})