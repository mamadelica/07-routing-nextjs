import { fetchNotes } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Notes from "./Notes.client";
import { NoteTag } from "@/types/note";

interface Props {
  params: Promise<{ slug: string[] }>;
}
const NotesPage = async ({ params }: Props) => {
  const { slug: tag } = await params;
  const searchTag = tag[0] === "all" ? undefined : tag[0];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", { currentPage: 1, search: "", tag: searchTag }],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag: searchTag as NoteTag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={searchTag as NoteTag} />
    </HydrationBoundary>
  );
};

export default NotesPage;