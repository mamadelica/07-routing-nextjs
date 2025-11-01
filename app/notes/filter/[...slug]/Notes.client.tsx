"use client";

import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./notes.module.css";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import { useState } from "react";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { NoteTag } from "@/types/note";

interface NotesProps {
  tag: NoteTag | undefined;
}

export default function Notes({ tag }: NotesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

  const { data } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", { currentPage, search: searchQuery, tag: tag }],
    queryFn: () =>
      fetchNotes({ page: currentPage, perPage: 12, search: searchQuery }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setCurrentPage(1);
    setSearchQuery(value);
  }, 500);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleInputChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            pageCount={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}