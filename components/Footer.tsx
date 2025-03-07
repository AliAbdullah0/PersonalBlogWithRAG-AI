import { FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full bg-[#f9b800] text-black py-4 px-4">
      <div className="w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Social Links */}
        <div className="flex gap-4">
          <a href="https://github.com/AliAbdullah0" target="_blank" rel="noopener noreferrer">
            <FiGithub className="w-5 h-5 hover:text-gray-600 transition-colors" />
          </a>
          <a href="https://instagram.com/your-profile" target="_blank" rel="noopener noreferrer">
            <FiInstagram className="w-5 h-5 hover:text-gray-600 transition-colors" />
          </a>
          <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
            <FiLinkedin className="w-5 h-5 hover:text-blue-700 transition-colors" />
          </a>
        </div>

        <div className="text-sm text-gray-900">
          © {new Date().getFullYear()} AstraX. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;