import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

emailjs.init("vQqL6uPAe9Uwj6Mbx");

/* ================= SEND EMAIL FUNCTION ================= */
export function sendEmail(to_email, to_name, subject, message) {

    return emailjs.send(
        "service_64ahlxr",
        "template_wdbtb26",
        {
            to_email: to_email,
            to_name: to_name,
            subject: subject,
            message: message
        }
    );

}
