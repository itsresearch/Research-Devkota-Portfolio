import images from "../Images";

// "All", "Full-stack projects", "Front-end projects"

const projectData = [
  //Full-Stack Projects
  {
    title: "GharSewa",
    category: "Full-stack projects",
    images: [
      images.ss1,
      images.ss2,
      images.ss3,
      images.ss4,
      images.ss5,
    ],
    live: " ",
    repo: "https://github.com/itsresearch/GharSewa-Online-Home-Service",
    video: " ",
    alt: "GharSewa",
    desc: `GharSewa Project is a Django-based web platform for booking and managing home services such as painting, plumbing, electrical work, cleaning, appliance repair, and more. It connects users with verified service providers, streamlining the process of finding, booking, and reviewing home services.`,
  },

  //Front-End Projects
  {
    title: "Online News Portal",
    category: "Back-end projects",
    images: [images.news1, images.news2, images.news3],
    live: "",
    repo: "https://github.com/itsresearch/News-Portal",
    video: " ",
    alt: "Online News Portal",
    desc: `I created a dynamic online news portal using Django, where users can browse, read, and stay updated with the latest news across multiple categories. The platform features an admin panel for easy content management, clean UI for a better reading experience, and organized news sections. It's designed to be fast, responsive, and simple ,just like news should be.
    `
  },


  {
    title: "Old Portfolio",
    category: "Front-end projects",
    images: [
      images.p1,
      images.p2,
      images.p3,
    ],
    live: " ",
    repo: "https://github.com/itsresearch/old-portfolio",
    video: " ",
    alt: "Old Portfolio",
    desc: `This is my old portfolio, if you have time check this out,`,
  },

   {
    title: "On going Projects....",
    category: "Front-end projects",
    images: [
      images.qrcodeLaptop,
      images.qrcodeLaptop,
      images.qrcodeMobile,
      images.qrcodeIPad,
    ],
    live: " ",
    repo: " ",
    video:
      " ",
    alt: "On going Projects",
    desc: ` `,
  },

 
];

export default projectData;
