import { useState } from "react";
import { easeInOut, motion } from "framer-motion";
import Popup from "./Popup";
import emailjs from "emailjs-com";

import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

function Contact() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const SERVICE_ID = "service_1wo7a9e"; 
  const TEMPLATE_ID = "template_6362j9k"; 
  const USER_ID = "zDKFyRapG70x_q-IO"; 

  const onSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
      time: new Date().toLocaleString(), // Add the time field
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, USER_ID)
      .then((result) => {
        setPopupMessage("Your message has been submitted successfully!");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
        form.reset();
      }, (error) => {
        setPopupMessage("Something went wrong. Please try again.");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeInOut }}
    >
      <div className="lg:mb-10 mb-8">
        <h1 className="lg:text-4xl text-3xl font-bold relative inline-block after:block after:h-[5px] after:w-full after:bg-amber-300 after:rounded-full after:mt-1">
          Contact
        </h1>
      </div>

      {/* Social Icons */}
      <div className="flex flex-col justify-center items-center">
        <h1 className="lg:text-2xl text-lg text-center mb-5 font-bold">
          Connect With Me
        </h1>
        <div className="flex justify-between items-center text-white/70 lg:w-[40%] w-full">
          <a
            target="__blank"
            href="https://www.instagram.com/research_.dev"
            className="scale-150 hover:text-amber-300 duration-200"
          >
            <InstagramIcon />
          </a>
          <a
            target="__blank"
            href="https://www.linkedin.com/in/research-devkota-16a019278"
            className="scale-150 hover:text-amber-300 duration-200"
          >
            <LinkedInIcon />
          </a>
          <a
            target="__blank"
            href="https://github.com/itsresearch"
            className="scale-150 hover:text-amber-300 duration-200"
          >
            <GitHubIcon />
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mt-15">
        <form onSubmit={onSubmit}>
          <div className="flex justify-between items-center lg:flex-row flex-col gap-5 mb-10">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="outline outline-white/30 rounded-lg p-3 w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="outline outline-white/30 rounded-lg p-3 w-full"
              required
            />
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Message"
              required
              rows={5}
              className="outline outline-white/30 rounded-lg p-3 w-full mb-8"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-amber-300 text-black p-2 w-full rounded-2xl hover:bg-amber-400 duration-200 cursor-pointer"
          >
            Submit Form
          </button>
        </form>
      </div>

      {/* Popup Message */}
      {showPopup && <Popup message={popupMessage} />}
    </motion.div>
  );
}

export default Contact;
