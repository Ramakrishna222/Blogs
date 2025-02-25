// Load saved blogs from local storage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const savedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
    savedBlogs.forEach((blog, index) => {
        addBlogPost(blog.title, blog.content, blog.image, blog.timestamp, index);
    });
});

// Handle form submission
document.getElementById('blogForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('image').files[0];
    
    if (title && content) {
        const timestamp = new Date().toLocaleString(); // Get current date and time
        let imageData = null;
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageData = e.target.result; // Convert image to data URL
                saveBlogPost(title, content, imageData, timestamp); // Save blog with image
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveBlogPost(title, content, imageData, timestamp); // Save blog without image
        }
        
        document.getElementById('blogForm').reset(); // Clear the form
    } else {
        alert('Please fill in both title and content.');
    }
});

// Save blog post to local storage
function saveBlogPost(title, content, imageData, timestamp) {
    const blog = { title, content, image: imageData, timestamp };
    
    // Retrieve existing blogs from local storage
    const savedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
    savedBlogs.push(blog); // Add the new blog
    localStorage.setItem('blogs', JSON.stringify(savedBlogs)); // Save back to local storage
    
    // Display the blog post on the page
    addBlogPost(title, content, imageData, timestamp, savedBlogs.length - 1);
}

// Add blog post to the webpage
function addBlogPost(title, content, imageData, timestamp, index) {
    const ul = document.getElementById('posts');
    const li = document.createElement('li');
    
    li.innerHTML = `
        <h3>${title}</h3>
        <p><strong>Posted on:</strong> ${timestamp}</p>
        <p>${content}</p>
        <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    
    if (imageData) {
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = 'Blog Image';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.marginTop = '10px';
        img.style.borderRadius = '4px';
        li.appendChild(img);
    }
    
    ul.appendChild(li);
    
    // Add event listener to the delete button
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        deleteBlogPost(index);
    });
}

// Delete blog post
function deleteBlogPost(index) {
    // Retrieve saved blogs from local storage
    const savedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
    
    // Remove the blog post at the specified index
    savedBlogs.splice(index, 1);
    
    // Save the updated blogs back to local storage
    localStorage.setItem('blogs', JSON.stringify(savedBlogs));
    
    // Refresh the displayed blog posts
    refreshBlogPosts();
}

// Refresh the displayed blog posts
function refreshBlogPosts() {
    const ul = document.getElementById('posts');
    ul.innerHTML = ''; // Clear the current list
    
    // Reload blogs from local storage
    const savedBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
    savedBlogs.forEach((blog, index) => {
        addBlogPost(blog.title, blog.content, blog.image, blog.timestamp, index);
    });
}