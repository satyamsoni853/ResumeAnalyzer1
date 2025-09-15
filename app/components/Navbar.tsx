import * as React from 'react';
import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">Resume Analyzer</p>
            </Link>
            <div className='flex items-center gap-4'>
                <a href="https://satyamsoni-nextjs-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="primary-button w-fit">
                    My Portfolio
                </a>
                <Link to="/upload" className="primary-button w-fit">
                    Upload Your Resume
                </Link>
            </div>
        </nav>
    )
}
export default Navbar
