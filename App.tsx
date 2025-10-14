
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext.tsx';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import Routines from './components/Routines.tsx';
import Calendar from './components/Calendar.tsx';
import Profile from './components/Profile.tsx';
import WorkoutSession from './components/WorkoutSession.tsx';
import AiChat from './components/AiChat.tsx';
import Modal from './components/Modal.tsx';
import Toast from './components/Toast.tsx';
import SmartRoutineModal from './components/modals/SmartRoutineModal.tsx';
import CreateProfileModal from './components/modals/CreateProfileModal.tsx';
import EditProfileModal from './components/modals/EditProfileModal.tsx';
import WorkoutSummaryModal from './components/modals/WorkoutSummaryModal.tsx';
import VideoFeedbackModal from './components/modals/VideoFeedbackModal.tsx';
import Legend from './components/Legend.tsx';
import Reconditioning from './components/Reconditioning.tsx';
import CreateReconditioningPlanModal from './components/modals/CreateReconditioningPlanModal.tsx';
import Discipline from './components/Discipline.tsx';
import CreateHabitModal from './components/modals/CreateHabitModal.tsx';
import Nutrition from './components/Nutrition.tsx';
import NutritionSettingsModal from './components/modals/NutritionSettingsModal.tsx';
import MasterRegulation from './components/MasterRegulation.tsx';
import MasterRegulationSettingsModal from './components/modals/MasterRegulationSettingsModal.tsx';
import EvaluationModal from './components/modals/EvaluationModal.tsx';
import WeeklyCheckInModal from './components/modals/WeeklyCheckInModal.tsx';
import WeeklyCheckInFeedbackModal from './components/modals/WeeklyCheckInFeedbackModal.tsx';
import SynergyHub from './components/SynergyHub.tsx';
import VisualizationModal from './components/modals/VisualizationModal.tsx';
import AutonomyUnlockedModal from './components/modals/AutonomyUnlockedModal.tsx';
import SuccessManual from './components/SuccessManual.tsx';
import SuccessManualModal from './components/modals/SuccessManualModal.tsx';
import MonthlyCheckInModal from './components/modals/MonthlyCheckInModal.tsx';
import ChronotypeQuestionnaireModal from './components/modals/ChronotypeQuestionnaireModal.tsx';
import Flow from './components/Flow.tsx';
import FocusActivationModal from './components/modals/FocusActivationModal.tsx';
import ProtocolInstructionModal from './components/modals/ProtocolInstructionModal.tsx';
import PropheticInterventionModal from './components/modals/PropheticInterventionModal.tsx';

const PageRenderer: React.FC = () => {
  const { currentPage } = useAppContext();

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard />;
    case 'routines':
      return <Routines />;
    case 'calendar':
      return <Calendar />;
    case 'profile':
      return <Profile />;
    case 'session':
      return <WorkoutSession />;
    case 'legend':
      return <Legend />;
    case 'discipline':
        return <Discipline />;
    case 'reconditioning':
        return <Reconditioning />;
    case 'nutrition':
        return <Nutrition />;
    case 'master-regulation':
        return <MasterRegulation />;
    case 'success-manual':
        return <SuccessManual />;
    case 'flow':
        return <Flow />;
    // case 'synergy-hub':
    //     return <SynergyHub />;
    default:
      return <Dashboard />;
  }
};

const ModalRenderer: React.FC = () => {
    const { modal } = useAppContext();
    if (!modal.isOpen) return null;

    switch (modal.type) {
        case 'smart-routine-creator':
            return <SmartRoutineModal />;
        case 'create-profile':
             return <CreateProfileModal />;
        case 'edit-profile':
            return <EditProfileModal />;
        case 'workout-summary':
            return <WorkoutSummaryModal summary={modal.payload} />;
        case 'video-feedback':
            return <VideoFeedbackModal />;
        case 'create-reconditioning-plan':
            return <CreateReconditioningPlanModal />;
        case 'create-habit':
            return <CreateHabitModal />;
        case 'nutrition-settings':
            return <NutritionSettingsModal />;
        case 'master-regulation-settings':
            return <MasterRegulationSettingsModal />;
        case 'onboarding':
            return <EvaluationModal />;
        case 'weekly-check-in':
            return <WeeklyCheckInModal />;
        case 'monthly-check-in':
            return <MonthlyCheckInModal />;
        case 'weekly-check-in-feedback':
            return <WeeklyCheckInFeedbackModal feedback={modal.payload.feedback} />;
        case 'visualization':
            return <VisualizationModal />;
        case 'autonomy-unlocked':
            return <AutonomyUnlockedModal />;
        case 'success-manual':
            return <SuccessManualModal manualContent={modal.payload.manualContent} />;
        case 'chronotype-questionnaire':
            return <ChronotypeQuestionnaireModal />;
        case 'focus-activation':
            return <FocusActivationModal />;
        case 'protocol-instruction':
            return <ProtocolInstructionModal title={modal.payload.title} instructions={modal.payload.instructions} />;
        case 'prophetic-intervention':
            return <PropheticInterventionModal />;
        default:
            return null;
    }
};


const AppContent: React.FC = () => {
    const { isChatOpen, toast, userProfile, showModal } = useAppContext();

    React.useEffect(() => {
        if (!userProfile.onboardingCompleted) {
            showModal('onboarding');
        }
    }, [userProfile.onboardingCompleted, showModal]);

    return (
        <div className="bg-spartan-bg text-spartan-text min-h-screen flex">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto">
            <PageRenderer />
          </main>
          {isChatOpen && <AiChat />}
          <Modal>
            <ModalRenderer />
          </Modal>
          <Toast message={toast.message} isVisible={toast.isVisible} />
        </div>
    );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
