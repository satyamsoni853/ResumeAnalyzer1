import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SsResumeAnalyzer" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return <main className="bg-dark-900">
    <Navbar />

    {/* Hero Section */}
    <section className="hero">
      <h1 className="text-gradient">Smart feedback for your dream job</h1>
      <h2>Upload your resume, get ATS insights, and improve faster with clear, actionable suggestions.</h2>
      <div className="hero-actions">
        <Link to="/upload" className="primary-button w-fit text-lg font-semibold">Upload Resume</Link>
        <a href="https://satyamsoni-nextjs-portfolio.vercel.app/" target="_blank" rel="noreferrer" className="secondary-button w-fit text-lg font-semibold">Learn More</a>
      </div>
      <div className="stats mt-8">
        <div className="stat">
          <p className="text-4xl font-bold text-light-100">95%</p>
          <p className="text-light-200">Users get clearer resumes</p>
        </div>
        <div className="stat">
          <p className="text-4xl font-bold text-light-100">+25%</p>
          <p className="text-light-200">Avg. score improvement</p>
        </div>
        <div className="stat">
          <p className="text-4xl font-bold text-light-100">Seconds</p>
          <p className="text-light-200">To first feedback</p>
        </div>
      </div>
    </section>

    {/* Feature Cards */}
    <section className="w-full mt-8">
      <div className="features">
        <div className="feature-card">
          <h3 className="text-xl text-light-100 font-semibold mb-2">ATS Scoring</h3>
          <p className="text-light-200">Understand how applicant tracking systems read and rate your resume.</p>
        </div>
        <div className="feature-card">
          <h3 className="text-xl text-light-100 font-semibold mb-2">Actionable Feedback</h3>
          <p className="text-light-200">Specific, prioritized suggestions tailored to the role and description.</p>
        </div>
        <div className="feature-card">
          <h3 className="text-xl text-light-100 font-semibold mb-2">Private by Design</h3>
          <p className="text-light-200">Your files stay in your control. Remove them anytime.</p>
        </div>
      </div>
    </section>

    {/* Recent Resumes */}
    <section className="main-section">
      <div className="page-heading py-10">
        <h2 className="text-3xl text-light-100">Recent Resumes</h2>
        {!loadingResumes && resumes?.length === 0 ? (
          <p className="text-light-200">No resumes yet. Upload your first one to get started.</p>
        ) : (
          <p className="text-light-200">Review your submissions and check AI-powered feedback.</p>
        )}
      </div>

      {loadingResumes && (
        <div className="flex flex-col items-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" />
        </div>
      )}

      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      {!loadingResumes && resumes?.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-6 gap-4">
          <Link to="/upload" className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
        </div>
      )}
    </section>
  </main>
}
