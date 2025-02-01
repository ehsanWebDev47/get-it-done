import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSSProperties, useState } from "react";
import { Card, DATA } from "./dashboard";

const DashboardKit = () => {
  const containers = ["A", "B"];
  const [initialData, setInitialData] = useState(DATA);

  const [parent, setParent] = useState<UniqueIdentifier | null>(null);

  const [activeId, setActiveId] = useState(null);
  const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }
  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
    setActiveId(null);
    if (over) {
      console.log({ over });
      setInitialData((data) => [...data, { id: over.id, title: "New Item" }]);
    }
  }
  return (
    <div className="min-h-screen dark:bg-neutral-900">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {parent === null ? draggableMarkup : null}

        <div className="pt-8 flex gap-5 h-[calc(100vh-11rem)] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 dark:scrollbar-track-gray-800 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {containers.map((id) => (
            // We updated the Droppable component so it would accept an `id`
            // prop and pass it to `useDroppable`
            <Droppable key={id} id={id} initialData={initialData}>
              {parent === id ? draggableMarkup : "Drop here"}
            </Droppable>
          ))}
        </div>
      </DndContext>
    </div>
  );
};
export default DashboardKit;

function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style: CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: "11",
        position: "relative",
        display: "inline-block",
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      {/* {props.children} */}
      <Card {...listeners} {...attributes} title="Draggable" />
    </div>
  );
}

function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-100  dark:bg-neutral-800/90  min-w-[355px] h-fit ${
        isOver ? "border-4 border-green-600" : ""
      }`}
    >
      <div className="sticky top-0 z-10 left-0 right-0 pt-5 px-5  bg-gray-100  dark:bg-neutral-800/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <div className="size-2 rounded-full bg-indigo-600 dark:bg-indigo-500" />
            <p className="font-medium dark:text-neutral-100">To Do</p>
            <div className="size-5 bg-neutral-300 dark:bg-neutral-400 flex justify-center rounded-full items-center text-xs ml-1">
              4
            </div>
          </div>
          <div className="bg-indigo-200/70 dark:bg-indigo-500 flex items-center justify-center rounded-md size-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 text-indigo-600 dark:text-indigo-100 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        </div>
        <div className="w-full bg-indigo-600 dark:bg-indigo-500 h-1 mt-5 rounded-md" />
      </div>

      <div className="px-5 space-y-5 py-5 ">
        {props.initialData.map((item) => (
          <Card key={item.id} title={item.title} />
        ))}
      </div>
    </div>
  );
}
