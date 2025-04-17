import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Alert, Badge, Box, Button, Divider, Modal, ModalClose, ModalDialog, Sheet, Stack, Typography } from "@mui/joy";
import {
  FaArchive,
  FaBook,
  FaCalendarAlt,
  FaCalendarPlus,
  FaEdit,
  FaExclamationTriangle,
  FaList,
} from "react-icons/fa";
import NavBar from "./NavBar";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import PomodoroPage from "./pages/PomodoroPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import UpdateTaskPage from "./pages/UpdateTaskPage";
import NewDeadlineForm from "./components/NewDeadlineForm";
import DeadlinesList from "./DeadlinesList";
import ArchiveList from "./ArchiveList";
import Courses from "./Courses";
import Deadline from "./classes/deadline";
import logo from "/512_full.png";
import Calendar from "./Calendar";
import Settings from "./classes/settings";
import SettingsModal from "./components/SettingsModal";

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/tasks/create" element={<CreateTaskPage />} />
          <Route path="/tasks/update/:id" element={<UpdateTaskPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/deadline" element={<DeadlineTracker />} />
        </Routes>
      </div>
    </Router>
  );
}

function DeadlineTracker() {
  // Deadlines
  const [deadlines, setDeadlines] = useState(() => {
    let localValue = JSON.parse(localStorage.getItem("deadlines"));
    if (localValue == null) return [];
    return localValue.map((deadline) => {
      if (deadline.type === "Assignment" || deadline.type === "") {
        deadline.type = "Hand-in";
      }
      return deadline;
    });
  });
  useEffect(() => {
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  // Archive
  const [archived, setArchived] = useState(() => {
    let localValue = JSON.parse(localStorage.getItem("archived"));
    if (localValue == null) return [];
    localValue = localValue.map((deadline) => {
      if (deadline.type === "Assignment" || deadline.type === "") {
        deadline.type = "Hand-in";
      }
      return deadline;
    });
    return localValue;
  });
  useEffect(() => {
    localStorage.setItem("archived", JSON.stringify(archived));
  }, [archived]);

  // Courses
  const [courses, setCourses] = useState(() => {
    const localValue = JSON.parse(localStorage.getItem("courses"));
    if (localValue == null) return [];
    return localValue;
  });
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  // Settings
  const [settings, setSettings] = useState(() => {
    const localValueJson = localStorage.getItem("settings");
    if (!localValueJson) return new Settings({});
    const localValue = JSON.parse(localValueJson, (key, value) => {
      if (key === "") return new Settings(value);
      return value;
    });
    return localValue;
  });
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{
          width: "100vw",
          py: 1,
        }}
      >
        <Typography
          startDecorator={
            <img src={logo} alt="logo" style={{ width: 30, height: 30 }} />
          }
          level="title-lg"
          sx={{ color: "#fff" }}
        >
          Deadline Tracker
        </Typography>
        {/* <SettingsModal settings={settings} setSettings={setSettings} /> */}
      </Stack>
 
      <Sheet
        sx={{
          width: "100vw",
          minHeight: "calc(100vh - 63px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.body",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2, maxWidth: "80%" }}>
          <ManageCoursesModal
            courses={courses}
            setCourses={setCourses}
            deadlines={deadlines}
            setDeadlines={setDeadlines}
            archived={archived}
            setArchived={setArchived}
          />
          <NewDeadlineFormModal courses={courses} setDeadlines={setDeadlines} />
          <ArchiveModal
            archived={archived}
            setArchived={setArchived}
            setDeadlines={setDeadlines}
            courses={courses}
            settings={settings}
          />
        </Stack>

        {settings.view.includes("calendar") && (
          <>
            <Typography level="title-lg" startDecorator={<FaCalendarAlt />} sx={{ mt: 2 }}>
              Calendar
            </Typography>
            <Typography level="body-md" sx={{ textAlign: "center" }}>
              Click a deadline to see details, or drag and drop to move it.
            </Typography>
            <Box
              sx={{
                width: { xs: "98%", sm: "90%", md: "70%", lg: "60%" },
                mt: 2,
              }}
            >
              <Calendar
                archived={archived}
                setArchived={setArchived}
                deadlines={deadlines}
                courses={courses}
                setDeadlines={setDeadlines}
                settings={settings}
              />
            </Box>
          </>
        )}

        {settings.view.includes("list") && (
          <>
            <Typography level="title-lg" startDecorator={<FaList />} sx={{ mt: 3 }}>
              Deadlines
            </Typography>
            <Typography level="body-md">View and manage your deadlines.</Typography>
            <Sheet
              sx={{
                width: { xs: "100%", sm: "90%", md: "80%", lg: "60%" },
                mt: 2,
              }}
            >
              <DeadlinesList
                deadlines={deadlines}
                setDeadlines={setDeadlines}
                archived={archived}
                setArchived={setArchived}
                courses={courses}
                settings={settings}
              />
            </Sheet>
          </>
        )}
      </Sheet>

      <Divider />
      <Sheet
        sx={{
          position: "relative",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Alert
          variant="plain"
          color="warning"
          sx={{
            textAlign: "center",
            borderRadius: 0,
          }}
          startDecorator={<FaExclamationTriangle />}
        >
          Please note that data is stored locally in your browser. If you clear your browser data, your deadlines will
          be lost.
        </Alert>
      </Sheet>
    </>
  );
}

function ManageCoursesModal({ ...props }) {
  const hasCourses = props.courses.length != 0;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Badge invisible={hasCourses} badgeContent={"Add Course!"} color="danger">
        <Button variant="solid" color="primary" startDecorator={<FaBook />} onClick={() => setOpen(true)}>
          Manage Courses
        </Button>
      </Badge>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalDialog>
          <ModalClose />
          <Typography level="title-lg" startDecorator={<FaBook />}>
            Manage Courses
          </Typography>
          <Typography level="body-md">Add, edit, and remove courses.</Typography>
          <Alert variant="soft" color="primary" size="md" sx={{ mt: 1, mb: 1.5 }} startDecorator={<FaEdit />}>
            <Typography level="title-md">Click a course to edit it</Typography>
          </Alert>
          <Courses open={open} setOpen={setOpen} {...props} />
        </ModalDialog>
      </Modal>
    </>
  );
}

function NewDeadlineFormModal({ courses, setDeadlines }) {
  const [open, setOpen] = useState(false);
  const [newDeadline, setNewDeadline] = useState(() => {
    const localValue = JSON.parse(sessionStorage.getItem("newDeadline"));
    if (localValue == null) return new Deadline({});
    return localValue;
  });

  useEffect(() => {
    if (!open) {
      sessionStorage.setItem("newDeadline", JSON.stringify(newDeadline));
    }
  }, [open, newDeadline]);

  return (
    <>
      <Button
        disabled={courses.length === 0}
        variant="solid"
        color="primary"
        startDecorator={<FaCalendarPlus />}
        onClick={() => setOpen(true)}
      >
        New Deadline
      </Button>
      <Modal
        open={open}
        onClose={(_event, reason) => {
          if (reason !== "escapeKeyDown") setOpen(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalDialog>
          <ModalClose />
          <Typography level="title-lg" startDecorator={<FaCalendarPlus />} sx={{ mb: 2 }}>
            New Deadline
          </Typography>
          <NewDeadlineForm
            open={open}
            setOpen={setOpen}
            courses={courses}
            setDeadlines={setDeadlines}
            newDeadline={newDeadline}
            setNewDeadline={setNewDeadline}
          />
        </ModalDialog>
      </Modal>
    </>
  );
}

function ArchiveModal({ ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Badge
        invisible={props.archived.length === 0}
        badgeContent={props.archived.length}
        color="warning"
        variant="outlined"
      >
        <Button
          disabled={props.archived.length === 0}
          id="archived-button"
          variant="outlined"
          color="warning"
          startDecorator={<FaArchive />}
          onClick={() => setOpen(true)}
          sx={{ width: "100%" }}
        >
          Archived
        </Button>
      </Badge>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalDialog>
          <ModalClose />
          <Typography level="title-lg" startDecorator={<FaArchive />}>
            Archived
          </Typography>
          <Typography level="body-md" sx={{ mb: 2 }}>
            View and restore archived deadlines.
          </Typography>
          <ArchiveList {...props} />
        </ModalDialog>
      </Modal>
    </>
  );
}

export default App;