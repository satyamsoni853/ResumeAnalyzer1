import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [imagePath]);

    return (
        <Link to={`/resume/${id}`} className="recent-resume-card hover-lift animate-in fade-in duration-700">
            {/* Thumbnail */}
            <div className="recent-resume-thumb">
                <div className="thumb-frame">
                    {resumeUrl && (
                        <img
                            src={resumeUrl}
                            alt="resume preview"
                            className="thumb-img"
                        />
                    )}
                </div>
            </div>

            {/* Meta */}
            <div className="recent-resume-meta">
                <div className="recent-resume-header">
                    <div className="recent-resume-title">
                        {companyName ? (
                            <h2>{companyName}</h2>
                        ) : (
                            <h2>Resume</h2>
                        )}
                        {jobTitle && <h3>{jobTitle}</h3>}
                    </div>
                    <div className="recent-resume-score">
                        <ScoreCircle score={feedback.overallScore} size={72} />
                    </div>
                </div>

                {/* Subscores */}
                <div className="recent-resume-subscores">
                    <div className="recent-resume-chip"><span>ATS</span><span className="text-light-100 font-semibold">{feedback.ATS.score}</span></div>
                    <div className="recent-resume-chip"><span>Content</span><span className="text-light-100 font-semibold">{feedback.content.score}</span></div>
                    <div className="recent-resume-chip"><span>Structure</span><span className="text-light-100 font-semibold">{feedback.structure.score}</span></div>
                    <div className="recent-resume-chip"><span>Skills</span><span className="text-light-100 font-semibold">{feedback.skills.score}</span></div>
                </div>

                <div className="recent-resume-footer">
                    <span className="recent-resume-link">View details →</span>
                </div>
            </div>
        </Link>
    )
}
export default ResumeCard
