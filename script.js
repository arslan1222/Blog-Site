document.getElementById("addBlogBtn").onclick = function () {
  $("#blogModal").modal("show");
};

document.getElementsByClassName("close")[0].onclick = function () {
  $("#blogModal").modal("hide");
};

document.getElementById("addBlogForm").onsubmit = function (event) {
  event.preventDefault();

  const title = document.getElementById("blogTitle").value;
  const poster = document.getElementById("blogPoster").value;
  const description = document.getElementById("blogDescription").value;
  const content = document.getElementById("blogContent").value;

  const blogId = Date.now();
  const blogData = {
    title,
    poster,
    description,
    content,
  };

  localStorage.setItem(`blog_${blogId}`, JSON.stringify(blogData));
  addBlogToList(blogId, blogData);
  $("#blogModal").modal("hide");
};

function addBlogToList(id, blogData) {
  const blogList = document.getElementById("blogList");
  const blogPost = document.createElement("div");
  blogPost.classList.add("blog-post", "p-3", "bg-light", "rounded");
  blogPost.innerHTML = `
        <h3>${blogData.title}</h3>
        <p>${blogData.description}</p>
        <button class="btn btn-info" onclick="viewBlog(${id})">Read More</button>
    `;
  blogList.appendChild(blogPost);
}

function viewBlog(id) {
  window.location.href = `blog.html?id=${id}`;
}

window.onload = function () {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("blog_")) {
      const blogData = JSON.parse(localStorage.getItem(key));
      const id = key.split("_")[1];
      addBlogToList(id, blogData);
    }
  }
};

document
  .getElementById("addBlogForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("blogTitle").value;
    const poster = document.getElementById("blogPoster").value;
    const description = document.getElementById("blogDescription").value;
    const content = document.getElementById("blogContent").value;
    const imageInput = document.getElementById("blogImage");

    if (
      title &&
      poster &&
      description &&
      content &&
      imageInput.files.length > 0
    ) {
      const blogId = Date.now();

      const blog = {
        id: blogId,
        title: title,
        poster: poster,
        description: description,
        content: content,
        image: "",
      };

  
      const reader = new FileReader();
      reader.onload = function (event) {
        blog.image = event.target.result;
 
        localStorage.setItem(`blog_${blogId}`, JSON.stringify(blog));
        addBlogCard(blog);
        showSuccessMessage();

        document.getElementById("addBlogForm").reset();
        $("#blogModal").modal("hide");
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      showErrorMessage();
    }
  });

const blogsPerPage = 10;
let currentPage = 1;
const blogs = Object.keys(localStorage)
  .filter((key) => key.startsWith("blog_"))
  .map((key) => JSON.parse(localStorage.getItem(key)))
  .sort((a, b) => new Date(b.date) - new Date(a.date));

function displayBlogs(page) {
  const startIndex = (page - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);
  const blogContainer = document.getElementById("blogContainer");
  blogContainer.innerHTML = "";

  currentBlogs.forEach((blog) => {
    const blogCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="${blog.image}" class="card-img-top" alt="${blog.title}">
                            <div class="card-body">
                                <h5 class="card-title">${blog.title}</h5>
                                <p class="card-text">${blog.description}</p>
                                <a href="blog.html?id=${blog.id}" class="btn btn-primary">Read More</a>
                            </div>
                        </div>
                    </div>
                `;
    blogContainer.innerHTML += blogCard;
  });
}

function setupPagination() {
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const prevButton = `
                <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                    <a class="page-link" href="#" onclick="changePage(${
                      currentPage - 1
                    })">Previous</a>
                </li>
            `;
  pagination.innerHTML += prevButton;

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = `
                    <li class="page-item ${i === currentPage ? "active" : ""}">
                        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                    </li>
                `;
    pagination.innerHTML += pageItem;
  }

  const nextButton = `
                <li class="page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }">
                    <a class="page-link" href="#" onclick="changePage(${
                      currentPage + 1
                    })">Next</a>
                </li>
            `;
  pagination.innerHTML += nextButton;
}

function changePage(page) {
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  displayBlogs(currentPage);
  setupPagination();
}

displayBlogs(currentPage);
setupPagination();

function loadBlogs() {
  const blogContainer = document.getElementById("blogList");
  blogContainer.innerHTML = "";

  // Get all keys from LocalStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("blog_")) {
      const blog = JSON.parse(localStorage.getItem(key));
      const blogId = key.split("_")[1];
      blogContainer.innerHTML += `
                <div class="col-md-6 blog-post" id="blog_${blogId}">
                    <div class="card mb-4">
                        <img src="${blog.image}" alt="Blog Image" class="card-img-top img-fluid blog-image">
                        <div class="card-body">
                            <h5 class="card-title">${blog.title}</h5>
                            <p class="card-text">${blog.description}</p>
                            <button class="btn btn-danger" onclick="deleteBlog('${blogId}')">Delete</button>
                        </div>
                    </div>
                </div>
            `;
    }
  });
}
