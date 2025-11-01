import React from "react";
import css from "./LayoutNotes.module.css";

interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function NotesLayout({ sidebar, children }: FilterLayoutProps) {
  return (
    <div className={css["container"]}>
      <aside className={css["sidebar"]}>{sidebar}</aside>
      <div className={css["notesWrapper"]}> {children}</div>
    </div>
  );
}