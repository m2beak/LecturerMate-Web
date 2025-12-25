import { useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { Header } from "@/components/layout/Header";
import { NotesList } from "@/components/notes/NotesList";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { AddVideoDialog } from "@/components/notes/AddVideoDialog";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FlashcardStudy } from "@/components/study/FlashcardStudy";
import { VideoNote } from "@/types/note";
import {
  BookOpen,
  Clock,
  Tag,
  Play,
  Youtube,
  Zap,
  Shield,
  Brain,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const {
    notes,
    allNotes,
    currentNote,
    setCurrentNote,
    createNote,
    updateNote,
    removeNote,
    addTimestamp,
    removeTimestamp,
    searchQuery,
    setSearchQuery,
  } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);

  const handleSelectNote = (note: VideoNote) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const handleAddVideo = (videoId: string, title: string, url: string) => {
    // Check if note for this video already exists
    const existingNote = allNotes.find((n) => n.videoId === videoId);
    if (existingNote) {
      setCurrentNote(existingNote);
      setIsEditing(true);
      return;
    }

    const newNote = createNote(videoId, title, url);
    setIsEditing(true);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setIsStudyMode(false);
    setCurrentNote(null);
  };

  const handleStudyFlashcards = () => {
    setIsStudyMode(true);
  };

  const totalTimestamps = allNotes.reduce(
    (acc, note) => acc + note.timestamps.length,
    0
  );

  const totalTags = new Set(allNotes.flatMap((note) => note.tags)).size;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />

      <main className="container mx-auto px-4 py-8">
        {!isEditing ? (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <section className="text-center py-12 relative">
              <div className="absolute inset-0 gradient-bg opacity-5 blur-3xl" />
              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Welcome to{" "}
                  <span className="gradient-text">LecturerMate</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                  Take smart notes while watching YouTube videos. Add timestamps,
                  look up words, and export your notes with ease.
                </p>
                <AddVideoDialog onAddVideo={handleAddVideo} />
              </div>
            </section>

            {/* Stats Section */}
            {allNotes.length > 0 && (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Notes"
                  value={allNotes.length}
                  icon={BookOpen}
                  description="Video notes created"
                  iconClassName="bg-primary/10 text-primary"
                />
                <StatsCard
                  title="Timestamps"
                  value={totalTimestamps}
                  icon={Clock}
                  description="Saved moments"
                  iconClassName="bg-accent/20 text-accent-foreground"
                />
                <StatsCard
                  title="Unique Tags"
                  value={totalTags}
                  icon={Tag}
                  description="Categories used"
                  iconClassName="bg-success/20 text-success"
                />
                <StatsCard
                  title="Recent Activity"
                  value={
                    allNotes.length > 0
                      ? allNotes.sort(
                          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
                        )[0].updatedAt.toLocaleDateString()
                      : "N/A"
                  }
                  icon={Play}
                  description="Last update"
                  iconClassName="bg-chart-5/20 text-chart-5"
                />
              </section>
            )}

            {/* Features Section (when no notes) */}
            {allNotes.length === 0 && (
              <section className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8">
                <FeatureCard
                  icon={Youtube}
                  title="YouTube Integration"
                  description="Paste any YouTube video URL and start taking notes instantly."
                />
                <FeatureCard
                  icon={Clock}
                  title="Timestamp Notes"
                  description="Add timestamps to jump to specific moments in your videos."
                />
                <FeatureCard
                  icon={Brain}
                  title="AI Flashcards"
                  description="Generate study flashcards from your notes with AI assistance."
                />
                <FeatureCard
                  icon={Zap}
                  title="AI Explanations"
                  description="Get instant AI explanations for any text you select."
                />
                <FeatureCard
                  icon={BookOpen}
                  title="Dictionary Lookup"
                  description="Select any word to look up its definition instantly."
                />
                <FeatureCard
                  icon={Tag}
                  title="Tag & Organize"
                  description="Add tags to categorize and search through your notes easily."
                />
                <FeatureCard
                  icon={Shield}
                  title="Export Options"
                  description="Export your notes to Markdown or copy to clipboard."
                />
                <FeatureCard
                  icon={Shield}
                  title="Local Storage"
                  description="Your notes are saved locally on your device for privacy."
                />
              </section>
            )}

            {/* Notes List Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Notes</h2>
                {allNotes.length > 0 && (
                  <AddVideoDialog onAddVideo={handleAddVideo} />
                )}
              </div>
              <NotesList
                notes={notes}
                currentNote={currentNote}
                onSelectNote={handleSelectNote}
                onDeleteNote={removeNote}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </section>
          </div>
        ) : currentNote ? (
          isStudyMode ? (
            <FlashcardStudy
              note={currentNote}
              onClose={() => setIsStudyMode(false)}
            />
          ) : (
            <NoteEditor
              note={currentNote}
              onUpdate={updateNote}
              onClose={handleCloseEditor}
              onAddTimestamp={addTimestamp}
              onRemoveTimestamp={removeTimestamp}
              onStudyFlashcards={handleStudyFlashcards}
            />
          )
        ) : null}
      </main>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-primary-foreground" />
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Index;
