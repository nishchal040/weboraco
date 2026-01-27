function sendmail() {
    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    emailjs
        .send("service_qpdunv7", "template_8jomi5v", params)
        .then(() => {
            alert("Message sent successfully!");
            document.querySelector("form").reset();
        })
        .catch((error) => {
            alert("Failed to send message.");
            console.error(error);
        });
}


function showmenu()
{
    const menu=document.getElementById('list')
        menu.classList.toggle("active");
}