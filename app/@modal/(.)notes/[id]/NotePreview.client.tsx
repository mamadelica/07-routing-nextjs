"use client";

import css from "./NotePreview.module.css";
import Modal from "@/components/Modal/Modal";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";

export default function NotePreview() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong.</p>;

  const handleClosePreview = () => {
    router.back();
  };

  const { tag, title, content, createdAt, updatedAt } = note;

  const formattedDate = note.updatedAt
    ? `Updated at: ${updatedAt}`
    : `Created at: ${createdAt}`;

  return (
    <Modal onClose={handleClosePreview}>
      <div className={css.container}>
        {note && (
          <div className={css.item}>
            <div className={css.tag}>{tag}</div>
            <div className={css.header}>
              <h2>{title}</h2>
            </div>
            <p className={css.content}>{content}</p>
            <p className={css.date}>{formattedDate}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}