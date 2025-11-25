import educationData from '../../data/education'

// Material icons
import Card from './Card'
import LaptopIcon from '@mui/icons-material/Laptop'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import SchoolIcon from '@mui/icons-material/School'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Title */}
      <div className="lg:mb-8 mb-7">
        <h1 className="lg:text-4xl text-3xl font-bold relative inline-block after:block after:h-[5px] after:w-full after:bg-amber-300 after:rounded-full after:mt-1">
          About Me
        </h1>
      </div>

      {/* Bio Section */}
      <div className="lg:min-h-[27vh] flex flex-col justify-between items-start mb-8">
        <p className="text-[15px] text-white/80 mb-5">
          <h2>Hi,I'm Research Devkota, a 7th-semester Bachelor’s student in Information Management with
          a strong foundation in technology and programming. I’m versatile,
          adaptable, and able to work confidently in changing environments.
          Whether it’s tight deadlines or high-pressure tasks, I stay focused
          and deliver results.My curiosity drives me to learn new skills quickly
          and apply them effectively. I enjoy working both independently and in
          teams, always aiming to give my best. Eager to grow,contribute, and
          take on meaningful challenges in any role I step into.</h2>
        </p>
        <a
  href="/Research-Devkota-Portfolio/research_original_resume.pdf"
  download="research_original_resume.pdf"
  className="mt-4 bg-amber-300 text-black px-6 py-2 rounded-md hover:bg-amber-400 transition-colors shadow-xl/50 custom-resume-btn"
>
  View Resume
</a>

      </div>

      {/* Card Section */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-6">What I'm Doing, Right Now</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card
            icon={<LaptopIcon />}
            title="Web Development"
            desc="I build full-stack web projects using HTML, CSS, JavaScript, React.js for the frontend, and Python, Django, and PostgreSQL for the backend. I focus on creating responsive, user-friendly interfaces and robust backend systems to deliver complete and efficient web solutions."
          />
          <Card
            icon={<EmojiObjectsIcon />}
            title="Python instructor at Mero Coding Class."
            desc="I am a remote Python instructor at Mero Coding Class, where I recently started teaching. I help students build a strong foundation in Python by guiding them through practical coding exercises and real-life examples. My goal is to make learning Python simple, engaging, and effective for beginners."
          />
          <Card
            icon={<LocalLibraryIcon />}
            title="DevOps"
            desc="I am currently learning DevOps, with a focus on Linux fundamentals, networking and security concepts, Python scripting, version control (Git), and containerization with Docker. I'm continuously expanding my skills to build efficient, secure, and automated development and deployment workflows."
          />
        </div>
      </div>

      {/* Education Section */}
      <div className="mt-12">
        <h1 className="text-2xl font-bold mb-6">About My Studies</h1>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="bg-[#1e1e1fc4] p-6 rounded-lg shadow-xl/50 outline outline-white/30">
            <div className="flex items-center mb-4">
              <SchoolIcon
                className="text-amber-300 mr-3 scale-125"
                fontSize="medium"
              />
              <h2 className="text-xl font-semibold">Education</h2>
            </div>

            <div className="space-y-6">
              {educationData.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-medium mb-1">{edu.title}</h3>
                  <p className="text-sm text-gray-400">{edu.collage}</p>
                  <p className="text-sm text-gray-400"> <span>CGPA: {edu.CGPA}</span></p>
                  <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-gray-400">
                    <span>{edu.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default About
