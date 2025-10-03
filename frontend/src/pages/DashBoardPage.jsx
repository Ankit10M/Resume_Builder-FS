import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { dashboardStyles as styles } from "../assets/dummystyle";
import { useNavigate } from "react-router-dom";
import { LucideFilePlus, LucideTrash2 } from "lucide-react";
import axiosInstances from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { ResumeSummaryCard } from "../components/Cards";
import toast from "react-hot-toast";
import moment from "moment";
import Model from "../components/Model";
import CreateResumeForm from "../components/CreateResumeForm";
const DashBoardPage = () => {
  const navigate = useNavigate();
  const [openCreateModel, setopenCreateModel] = useState(false);
  const [allResumes, setallResumes] = useState([]);
  const [loading, setloading] = useState(true);
  const [resumeTodelete, setresumeTodelete] = useState(null);
  const [showDelete, setshowDelete] = useState(false);

  const calculateCompletion = (resume) => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    // Work Experience
    resume.workExperience?.forEach((exp) => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resume.education?.forEach((edu) => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resume.skills?.forEach((skill) => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resume.projects?.forEach((project) => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resume.certifications?.forEach((cert) => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resume.languages?.forEach((lang) => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resume.interests?.length || 0;
    completedFields +=
      resume.interests?.filter((i) => i?.trim() !== "")?.length || 0;

    return Math.round((completedFields / totalFields) * 100);
  };
  const fetchallUsers = async () => {
    try {
      setloading(true);
      const response = await axiosInstances.get(API_PATHS.RESUME.GET_ALL);
      // Add completion % to each resumes
      const resumesWithCompletion = response.data.map((resume) => ({
        ...resume,
        completion: calculateCompletion(resume),
      }));
      setallResumes(resumesWithCompletion);
    } catch (error) {
      console.error("Error Fetching Resumes:", error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchallUsers();
  }, []);

  const handleDeleteResume = async () => {
    if (!resumeTodelete) return;
    try {
      await axiosInstances.delete(API_PATHS.RESUME.DELETE(resumeTodelete));
      toast.success("Resume Deleted Successfully");
      fetchallUsers();
    } catch (error) {
      console.error("Error Deleting Resume", error);
      toast.error("Failed to delete Resume");
    } finally {
      setresumeTodelete(null);
      setshowDelete(false);
    }
  };
  const handleDeleteClick = (id) => {
    setresumeTodelete(id);
    setshowDelete(true);
  };
  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div>
            <h1 className={styles.headerTitle}>My Resumes</h1>
            <p className={styles.headerSubtitle}>
              {allResumes.length > 0
                ? `You Have ${allResumes.length} resumes${
                    allResumes.length !== 1 ? "s" : " "
                  }`
                : "Start Building your resumes"}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className={styles.createButton}
              onClick={() => setopenCreateModel(true)}
            >
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}> Create Now</span>
              <LucideFilePlus
                className="group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </button>
          </div>
        </div>
        {/* Loading State */}
        {loading && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
          </div>
        )}
        {!loading && allResumes.length === 0 && (
          <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyIconWrapper}>
              <LucideFilePlus size={32} className="text-violet-600" />
            </div>
            <h3 className={styles.emptyTitle}>No Resume Yet</h3>
            <p className={styles.emptyText}>
              {" "}
              You Haven't Creatyed any Resumes Yet. Start Building your
              Professiobnal resume to land your Dream Job{" "}
            </p>
            <button
              className={styles.createButton}
              onClick={() => setopenCreateModel(true)}
            >
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                {" "}
                Create Your First Resume
                <LucideFilePlus
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </span>
            </button>
          </div>
        )}
        {/* Grid View */}
        {!loading && allResumes.length > 0 && (
          <div className={styles.grid}>
            <div
              className={styles.newResumeCard}
              onClick={() => setopenCreateModel(true)}
            >
              <div className={styles.newResumeIcon}>
                <LucideFilePlus size={32} className="text-white" />
              </div>
              <h3 className={styles.newResumeTitle}>Create New resume</h3>
              <p className={styles.newResumeText}>Start Building Your Career</p>
            </div>
            {allResumes.map((resume) => (
              <ResumeSummaryCard
                key={resume._id}
                imagUrl={resume.thumbnailLink}
                title={resume.title}
                createdAt={resume.createdAt}
                updatedAt={resume.updatedAt}
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDelete={() => handleDeleteClick(resume._id)}
                completion={resume.completion || 0}
                isPremium={resume.isPremium}
                isNew={moment().diff(moment(resume.createdAt), "days") < 7}
              />
            ))}
          </div>
        )}
      </div>
      {/* Create Model */}
      <Model
        isOpen={openCreateModel}
        onClose={() => setopenCreateModel(false)}
        hideHeader
        maxWidth="max-w-2xl"
      >
        <div className="p-6">
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Create New Resume</h3>
            <button
              onClick={() => setopenCreateModel(false)}
              className={styles.modalCloseButton}
            >
              X
            </button>
          </div>
          <CreateResumeForm
            onSuccess={() => {
              setopenCreateModel(false);
              fetchallUsers();
            }}
          />
        </div>
      </Model>
      {/* Delete Model */}
      <Model
        isOpen={showDelete}
        onClose={() => setshowDelete(false)}
        title="Confirm Delete"
        showActionBtn
        actionBtnText="Delete"
        actionBtnClassname="bg-red-600 hover:bg-red-700"
        onActionClick={handleDeleteResume}
      >
        <div className="p-4">
          <div className="flex flex-col items-center text-center">
            <div className={styles.deleteIconWrapper}>
              <LucideTrash2 size={24} />
            </div>
            
            <h3 className={styles.deleteTitle}>DeleteResume?</h3>
            <p className={styles.deleteText}>
              are you sure you want to delete this resume? This action cannot be
              undone.
            </p>
          </div>
        </div>
      </Model>
    </DashboardLayout>
  );
};

export default DashBoardPage;
