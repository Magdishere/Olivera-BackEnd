const API = "https://olivera-backend-s5ul.onrender.com";
// const API = "https://localhost:3000";

let featureEditId = "";
let featureDeleteId = "";
let serviceEditId = "";
let serviceDeleteId = "";
let pricingEditId = "";
let pricingDeleteId = "";
let contactEditId = "";
let contactDeleteId = "";


/* ========================= SECTION SWITCHER ========================= */
function showSection(section) {
    document.getElementById("features-section").classList.add("d-none");
    document.getElementById("services-section").classList.add("d-none");
    document.getElementById("pricing-section")?.classList.add("d-none");
    document.getElementById("contacts-section").classList.add("d-none");

    if (section === "features") {
        document.getElementById("features-section").classList.remove("d-none");
    } else if (section === "services") {
        document.getElementById("services-section").classList.remove("d-none");
        } else if (section === "pricing") {
        document.getElementById("pricing-section").classList.remove("d-none");
        } else if (section === "contacts") {
        document.getElementById("contacts-section").classList.remove("d-none");
    }
}

/* ========================= LOAD FEATURES ========================= */
function loadFeatures() {
    fetch(`${API}/features`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("features-list");

            container.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-light table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th style="width:140px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(f => `
                                <tr style="transition: background 0.2s;">
                                    <td>
                                        <div class="d-flex flex-column">
                                            <strong><i class="${f.icon}" style="font-size:20px;"></i> ${f.title}</strong>
                                            <small>${f.description}</small>
                                        </div>
                                    </td>
                                    <td>
                                      <div class="d-flex gap-2">
                                        <button class="btn btn-sm btn-primary me-2"
                                            onclick="openFeatureEditModal('${f._id}', '${f.icon}', '${f.title}', \`${f.description}\`)">
                                            Edit
                                        </button>
                                        <button class="btn btn-sm btn-danger"
                                            onclick="openFeatureDeleteModal('${f._id}')">
                                            Delete
                                        </button>
                                        </div>
                                    </td>
                                </tr>`).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        });
}

/* ========================= LOAD SERVICES ========================= */
function loadServices() {
    fetch(`${API}/services`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("services-list");

            container.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-light table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th style="width:140px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(s => `
                                <tr style="transition: background 0.2s;">
                                    <td>
                                        <div class="d-flex flex-column">
                                            <strong><i class="${s.icon}" style="font-size:20px;"></i> ${s.title}</strong>
                                            <small>${s.description}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-2">
                                            <button class="btn btn-sm btn-primary me-2"
                                                onclick="openServiceEditModal('${s._id}', '${s.icon}', '${s.title}', \`${s.description}\`)">
                                                Edit
                                            </button>
                                            <button class="btn btn-sm btn-danger"
                                                onclick="openServiceDeleteModal('${s._id}')">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>`).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        });
}

/* ========================= LOAD PRICING ========================= */
function loadPricing() {
    fetch(`${API}/pricing`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("pricing-list");

            container.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-light table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Plan</th>
                                <th style="width:180px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(p => `
                                <tr style="transition: background 0.2s;">
                                    <td>
                                        <div class="d-flex flex-column">
                                            <strong>${p.name} ${p.featured ? '<span class="badge bg-warning text-dark">Featured</span>' : ''}</strong>
                                            <small>${p.description}</small>
                                            <small>Price: $${p.price} / ${p.unit}</small>
                                            <small>Features: ${p.features.join(', ')}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-primary me-2"
                                            onclick="openPricingEditModal(
                                                '${p._id}',
                                                '${p.name.replace(/'/g, "&apos;")}',
                                                ${p.price},
                                                '${p.unit}',
                                                '${p.description.replace(/'/g, "&apos;")}',
                                                '${p.cta_text?.replace(/'/g, "&apos;")}',
                                                '${p.cta_link?.replace(/'/g, "&apos;")}',
                                                '${p.features.join("||").replace(/'/g, "&apos;")}',
                                                ${p.featured}
                                            )">
                                            Edit
                                        </button>
                                        <button class="btn btn-sm btn-danger"
                                            onclick="openPricingDeleteModal('${p._id}')">
                                            Delete
                                        </button>
                                    </td>
                                </tr>`).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        });
}

function loadContacts() {
    fetch(`${API}/contacts`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("contacts-list");

            container.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-light table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Contact Info</th>
                                <th>Status</th>
                                <th style="width:180px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(c => `
                                <tr>
                                    <td>
                                        <strong>${c.location}</strong><br>
                                        <small>Email: ${c.email}</small><br>
                                        <small>Phone: ${c.phone}</small>
                                    </td>
                                    <td>
                                        ${c.selected
                                            ? '<span class="badge bg-success">Active</span>'
                                            : '<span class="badge bg-danger">Inactive</span>'
                                        }
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-primary me-2"
                                            onclick="openContactEditModal('${c._id}', '${c.location}', '${c.email}', '${c.phone}', ${c.selected})">
                                            Edit
                                        </button>
                                        <button class="btn btn-sm btn-danger"
                                            onclick="openContactDeleteModal('${c._id}')">
                                            Delete
                                        </button>
                                    </td>
                                </tr>`).join("")}
                        </tbody>
                    </table>
                </div>
            `;
        });
}


function selectContact(id) {
    fetch(`${API}/contacts/select/${id}`, { method: "PUT" }) // was PATCH
        .then(() => loadContacts());
}


/* ========================= FEATURE MODALS ========================= */
function openFeatureAddModal() {
    new bootstrap.Modal(document.getElementById("addModal")).show();
}
function closeFeatureAddModal() {
    bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
}

function addFeatureFromModal() {
    const icon = document.getElementById("add-icon").value.trim();
    const title = document.getElementById("add-title").value.trim();
    const description = document.getElementById("add-description").value.trim();

    if (!icon || !title || !description) return alert("All fields required");

    fetch(`${API}/features`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icon, title, description })
    }).then(() => {
        closeFeatureAddModal();
        loadFeatures();
    });
}

function openFeatureEditModal(id, icon, title, description) {
    featureEditId = id;
    document.getElementById("edit-icon").value = icon;
    document.getElementById("edit-title").value = title;
    document.getElementById("edit-description").value = description;
    new bootstrap.Modal(document.getElementById("editModal")).show();
}

function closeFeatureEditModal() {
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
}

function saveFeatureEdit() {
    const icon = document.getElementById("edit-icon").value.trim();
    const title = document.getElementById("edit-title").value.trim();
    const description = document.getElementById("edit-description").value.trim();

    fetch(`${API}/features/${featureEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icon, title, description })
    }).then(() => {
        closeFeatureEditModal();
        loadFeatures();
    });
}

function openFeatureDeleteModal(id) {
    featureDeleteId = id;
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
}

function closeFeatureDeleteModal() {
    bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
}

function confirmFeatureDelete() {
    fetch(`${API}/features/${featureDeleteId}`, { method: "DELETE" })
        .then(() => {
            closeFeatureDeleteModal();
            loadFeatures();
        });
}

/* ========================= SERVICE MODALS ========================= */
function openServiceAddModal() {
    new bootstrap.Modal(document.getElementById("serviceAddModal")).show();
}
function closeServiceAddModal() {
    bootstrap.Modal.getInstance(document.getElementById("serviceAddModal")).hide();
}

function addServiceFromModal() {
    const icon = document.getElementById("service-add-icon").value.trim();
    const title = document.getElementById("service-add-title").value.trim();
    const description = document.getElementById("service-add-description").value.trim();

    if (!icon || !title || !description) return alert("All fields required");

    fetch(`${API}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icon, title, description })
    }).then(() => {
        closeServiceAddModal();
        loadServices();
    });
}

function openServiceEditModal(id, icon, title, description) {
    serviceEditId = id;
    document.getElementById("service-edit-icon").value = icon;
    document.getElementById("service-edit-title").value = title;
    document.getElementById("service-edit-description").value = description;
    new bootstrap.Modal(document.getElementById("serviceEditModal")).show();
}

function closeServiceEditModal() {
    bootstrap.Modal.getInstance(document.getElementById("serviceEditModal")).hide();
}

function saveServiceEdit() {
    const icon = document.getElementById("service-edit-icon").value.trim();
    const title = document.getElementById("service-edit-title").value.trim();
    const description = document.getElementById("service-edit-description").value.trim();

    fetch(`${API}/services/${serviceEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icon, title, description })
    }).then(() => {
        closeServiceEditModal();
        loadServices();
    });
}

function openServiceDeleteModal(id) {
    serviceDeleteId = id;
    new bootstrap.Modal(document.getElementById("serviceDeleteModal")).show();
}

function closeServiceDeleteModal() {
    bootstrap.Modal.getInstance(document.getElementById("serviceDeleteModal")).hide();
}

function confirmServiceDelete() {
    fetch(`${API}/services/${serviceDeleteId}`, { method: "DELETE" })
        .then(() => {
            closeServiceDeleteModal();
            loadServices();
        });
}

/* ========================= PRICING MODALS ========================= */
function openPricingAddModal() {
    new bootstrap.Modal(document.getElementById("pricingAddModal")).show();
}
function closePricingAddModal() {
    bootstrap.Modal.getInstance(document.getElementById("pricingAddModal")).hide();
}

function addPricingFromModal() {
    const name = document.getElementById("pricing-add-name").value.trim();
    const price = parseFloat(document.getElementById("pricing-add-price").value);
    const unit = document.getElementById("pricing-add-unit").value.trim();
    const description = document.getElementById("pricing-add-description").value.trim();
    const cta_text = document.getElementById("pricing-add-cta-text").value.trim();
    const cta_link = document.getElementById("pricing-add-cta-link").value.trim();
    const features = document.getElementById("pricing-add-features").value.split(',').map(f => f.trim());
    const featured = document.getElementById("pricing-add-featured").checked;

    if (!name || !price || !unit) return alert("Name, price, and unit are required");

    fetch(`${API}/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, unit, description, cta_text, cta_link, features, featured })
    }).then(() => {
        closePricingAddModal();
        loadPricing();
    });
}

function openPricingEditModal(id, name, price, unit, description, cta_text, cta_link, features, featured) {
    pricingEditId = id;

    document.getElementById("pricing-edit-name").value = name;
    document.getElementById("pricing-edit-price").value = price;
    document.getElementById("pricing-edit-unit").value = unit;
    document.getElementById("pricing-edit-description").value = description;
    document.getElementById("pricing-edit-cta-text").value = cta_text;
    document.getElementById("pricing-edit-cta-link").value = cta_link;

    // Decode features
    document.getElementById("pricing-edit-features").value = features.split("||").join(", ");

    document.getElementById("pricing-edit-featured").checked = featured;

    new bootstrap.Modal(document.getElementById("pricingEditModal")).show();
}

function closePricingEditModal() {
    bootstrap.Modal.getInstance(document.getElementById("pricingEditModal")).hide();
}

function savePricingEdit() {
    const name = document.getElementById("pricing-edit-name").value.trim();
    const price = parseFloat(document.getElementById("pricing-edit-price").value);
    const unit = document.getElementById("pricing-edit-unit").value.trim();
    const description = document.getElementById("pricing-edit-description").value.trim();
    const cta_text = document.getElementById("pricing-edit-cta-text").value.trim();
    const cta_link = document.getElementById("pricing-edit-cta-link").value.trim();
    const features = document.getElementById("pricing-edit-features").value.split(',').map(f => f.trim());
    const featured = document.getElementById("pricing-edit-featured").checked;

    fetch(`${API}/pricing/${pricingEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, unit, description, cta_text, cta_link, features, featured })
    }).then(() => {
        closePricingEditModal();
        loadPricing();
    });
}

function openPricingDeleteModal(id) {
    pricingDeleteId = id;
    new bootstrap.Modal(document.getElementById("pricingDeleteModal")).show();
}

function closePricingDeleteModal() {
    bootstrap.Modal.getInstance(document.getElementById("pricingDeleteModal")).hide();
}

function confirmPricingDelete() {
    fetch(`${API}/pricing/${pricingDeleteId}`, { method: "DELETE" })
        .then(() => {
            closePricingDeleteModal();
            loadPricing();
        });
}

function openContactAddModal() {
    new bootstrap.Modal(document.getElementById("contactAddModal")).show();
}
function closeContactAddModal() {
    bootstrap.Modal.getInstance(document.getElementById("contactAddModal")).hide();
}

function addContactFromModal() {
    const location = document.getElementById("contact-add-location").value.trim();
    const email = document.getElementById("contact-add-email").value.trim();
    const phone = document.getElementById("contact-add-phone").value.trim();
    const selected = document.getElementById("contact-add-selected").checked;

    if (!location || !email || !phone) return alert("All fields required");

    fetch(`${API}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, email, phone, selected })
    }).then(() => {
        closeContactAddModal();
        loadContacts();
    });
}


function createContact(contactData) {
    fetch(`${API}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData)
    }).then(() => {
        closeContactAddModal();
        loadContacts();
    });
}


function openContactEditModal(id, location, email, phone, selected) {
    contactEditId = id;
    document.getElementById("contact-edit-location").value = location;
    document.getElementById("contact-edit-email").value = email;
    document.getElementById("contact-edit-phone").value = phone;
    document.getElementById("contact-edit-selected").checked = selected;

    new bootstrap.Modal(document.getElementById("contactEditModal")).show();

}

function closeContactEditModal() {
    bootstrap.Modal.getInstance(document.getElementById("contactEditModal")).hide();
}

function saveContactEdit() {
    const location = document.getElementById("contact-edit-location").value.trim();
    const email = document.getElementById("contact-edit-email").value.trim();
    const phone = document.getElementById("contact-edit-phone").value.trim();
    const selected = document.getElementById("contact-edit-selected").checked;

    if (!location || !email || !phone) return alert("All fields required");

    fetch(`${API}/contacts/${contactEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, email, phone, selected })
    }).then(() => {
        closeContactEditModal();
        loadContacts();
    });
}

function updateContact(contactData) {
    fetch(`${API}/contacts/${contactEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData)
    }).then(() => {
        closeContactEditModal();
        loadContacts();
    });
}


function openContactDeleteModal(id) {
    contactDeleteId = id;
    new bootstrap.Modal(document.getElementById("contactDeleteModal")).show();
}

function closeContactDeleteModal() {
    bootstrap.Modal.getInstance(document.getElementById("contactDeleteModal")).hide();
}

function confirmContactDelete() {
    fetch(`${API}/contacts/${contactDeleteId}`, { method: "DELETE" })
        .then(() => {
            closeContactDeleteModal();
            loadContacts();
        });
}


/* ========================= INIT ========================= */
loadFeatures();
loadServices();
loadPricing();
loadContacts();
showSection("features");
