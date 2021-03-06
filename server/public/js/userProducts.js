(function ($) {
  let requestConfig = {
    method: "GET",
    url: `/private/users/${userId}`,
    contentType: "application/json",
  };

  $.ajax(requestConfig)
    .then(function (response) {
      const products = [];
      response.products.forEach(function (item, index) {
        $(".accordion").append(
          `<div class="accordion-item">
                    <h2 class="accordion-header" id=${item._id}>
                        <button
                            class="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target=#collapse${item._id}
                            aria-controls=collapse${item._id}
                            aria-expanded="false"
                        >
                            ${item.productName}
                        </button>
                    </h2>
                    <div
                        id=collapse${item._id}
                        class="accordion-collapse collapse ${
                          index == 0 ? "show" : ""
                        }"
                        aria-labelledby=${item._id}
                        data-bs-parent="#accordionExample"
                    >
                        <div class="accordion-body d-flex 
                        flex-wrap
                        align-items-center flex-direction-column justify-content-between">
                            <button id=${
                              item._id
                            } class="editProduct w-40" type="button" data-bs-toggle="modal" data-bs-target="#myModal">View/Edit Details</button>
                            <button class="w-40">Delete</button>
                        </div>
                    </div>
                </div>`
        );
      });
    })
    .catch(function (err) {
      console.log(err);
    });

  $(document).bind("click", function (event) {
    var target = $(event.target);
    if (target.is(".editProduct")) {
      const productId = event.target.id;
      let productDetailsRequestConfig = {
        method: "GET",
        url: `/products/${productId}/details`,
        contentType: "application/json",
      };
      $.ajax(productDetailsRequestConfig).then(function (response) {
        $("#updateProductForm").attr(
          "action",
          `/products//update/${productId}`
        );
        $("#productName").val(response.name);
        $("#productDescription").val(response.description);
        $("#productUrl").val(response.site);
        $("#developer").val(response.developer);
        $("#developer").val(response.developer);
        $("#productTag").val(response.tags.toString());
        $("#productfile").file(`/public/images/upload/${response.logo}`);
      });
    }
  });

  document.forms["updateProductForm"].addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData($("#updateProductForm")[0]);

    fetch(event.target.action, {
      method: "POST",
      body: formData,
    })
      .then((resp) => {
        return resp.json(); // or resp.text() or whatever the server sends
      })
      .then((body) => {
        console.log(body?.error);
        if (body.error) {
          document.querySelector(".errorCreateProduct").innerHTML = body.error;
        } else {
          resa = 1;
        }
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  });

  $("#close").click(function () {
    $("#exampleModalCenter").modal("hide");
  });
})(jQuery);
