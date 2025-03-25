document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "signin.html";
        return;
    }

    const res = await fetch("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    document.getElementById("username").textContent = data.username;

    loadPosts();
});

async function loadPosts() {
    const res = await fetch("http://localhost:5000/api/posts");
    const posts = await res.json();

    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = "";
    
    posts.forEach(post => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h4>${post.title}</h4>
            <p>${post.content}</p>
            <button onclick="deletePost('${post._id}')">Delete</button>
        `;
        postsContainer.appendChild(div);
    });
}

async function createPost() {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;

    const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title, content })
    });

    if (res.ok) {
        loadPosts();
    }
}

async function deletePost(postId) {
    await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    loadPosts();
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "signin.html";
}
