import {
  ListDropTargetDelegate,
  ListKeyboardDelegate,
  mergeProps,
  useButton,
  useDrag,
  useDrop,
  useDropIndicator,
  useDroppableCollection,
  useDroppableItem,
  useFocusRing,
  useListBox,
  useOption,
} from "react-aria";
import type { TextDropItem } from "react-aria";
import { DragEvent, HtmlHTMLAttributes, useRef, useState } from "react";
import {
  Item,
  useDroppableCollectionState,
  useListData,
  useListState,
} from "react-stately";

const DATA = [
  {
    id: 1,
    title: "Brainstorming",
  },
  {
    id: 2,
    title: "Planning",
  },
  {
    id: 3,
    title: "Design",
  },
  {
    id: 4,
    title: "Development",
  },
  {
    id: 5,
    title: "Testing",
  },
  {
    id: 6,
    title: "Deployment",
  },
];

const DashboardARIA = () => {
  const [initialData, setInitialData] = useState(DATA);

  const [isExpanded, setIsExpanded] = useState(false);

  let [dropped, setDropped] = useState<string | null>(null);
  let ref = useRef(null);
  let { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      let item = e.items.find(
        (item) => item.kind === "text" && item.types.has("my-app-custom-type")
      ) as TextDropItem;
      if (item) {
        console.log({ item });
        setDropped(await item.getText("my-app-custom-type"));
      }
    },
  });

  let list = useListData({
    initialItems: [
      { id: 1, name: "Cat" },
      { id: 2, name: "Dog" },
      { id: 3, name: "Kangaroo" },
    ],
  });

  let onInsert = async (e) => {
    let name = await e.items[0].getText("text/plain");

    let item = { id: list.items.length + 1, name };
    if (e.target.dropPosition === "before") {
      list.insertBefore(e.target.key, item);
    } else if (e.target.dropPosition === "after") {
      list.insertAfter(e.target.key, item);
    }
  };

  return (
    <div className="min-h-screen dark:bg-neutral-200">
      <Draggable>Octopus</Draggable>
      <div className=" mt-10 ml-10 border-2 border-black">
        <ListBox
          aria-label="Favorite animals"
          selectionMode="single"
          items={list.items}
          acceptedDragTypes={["text/plain"]}
          onInsert={onInsert}
        >
          {(item) => <Item>{item.name}</Item>}
        </ListBox>
      </div>

      {/* <main className=" pt-16">
        <section className={`flex-1 ${isExpanded ? "ml-72" : "ml-24"} mt-8`}>
          <h1 className="font-bold text-3xl dark:text-white">Project Name</h1>

          <div className="mt-8 flex gap-5 h-[calc(100vh-11rem)] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 dark:scrollbar-track-gray-800 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          
            <div className="bg-gray-100 relative z-20 dark:bg-neutral-800/90  min-w-[355px] h-fit">
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
                {initialData.map((item) => (
                  <Card key={item.id} title={item.title} />
                ))}
              </div>
            </div> */}

      {/* drop zone */}
      {/* <div
              {...dropProps}
              ref={ref}
              className={`border-2 h-72 w-full border-dashed  ${
                isDropTarget && "border-red-400"
              }`}
            >
              <p className=" dark: text-neutral-100">
                {dropped || "Drop here"}
              </p>
            </div> */}
      {/* </div>
        </section>
      </main> */}
    </div>
  );
};
// width: 100%;
// margin-left: 0;
// height: 2px;
// margin-bottom: -2px;
// outline: none;
// background: transparent;
function DropIndicator(props) {
  let ref = useRef(null);
  let { dropIndicatorProps, isHidden, isDropTarget } = useDropIndicator(
    props,
    props.dropState,
    ref
  );
  if (isHidden) {
    return null;
  }

  return (
    <li
      {...dropIndicatorProps}
      role="option"
      ref={ref}
      className={` w-full ml-0 h-1 -mb-0.5 outline-none bg-transparent ${
        isDropTarget ? " bg-blue-500" : ""
      }`}
    />
  );
}

function Draggable({ children }) {
  let { dragProps, dragButtonProps, isDragging } = useDrag({
    getAllowedDropOperations: () => ["copy"],
    getItems() {
      return [
        {
          "text/plain": children,
          "my-app-custom-type": JSON.stringify({ message: children }),
        },
      ];
    },
  });

  let ref = useRef(null);
  let { buttonProps } = useButton(
    { ...dragButtonProps, elementType: "div" },
    ref
  );

  return (
    <div
      {...mergeProps(dragProps, buttonProps)}
      ref={ref}
      className={`draggable ${isDragging ? "dragging" : ""}`}
    >
      <span aria-hidden="true">≡</span> {children}
    </div>
  );
}

function ListBox(props) {
  // Setup listbox as normal. See the useListBox docs for more details.
  let state = useListState(props);
  let ref = useRef(null);
  let { listBoxProps } = useListBox(props, state, ref);

  // Setup react-stately and react-aria hooks for drag and drop.
  let dropState = useDroppableCollectionState({
    ...props,
    // Collection and selection manager come from list state.
    collection: state.collection,
    selectionManager: state.selectionManager,
  });

  let { collectionProps } = useDroppableCollection(
    {
      ...props,
      // Provide drop targets for keyboard and pointer-based drag and drop.
      keyboardDelegate: new ListKeyboardDelegate(
        state.collection,
        state.disabledKeys,
        ref
      ),
      dropTargetDelegate: new ListDropTargetDelegate(state.collection, ref),
    },
    dropState,
    ref
  );

  // Merge listbox props and dnd props, and render the items as normal.
  return (
    <ul {...mergeProps(listBoxProps, collectionProps)} ref={ref}>
      {[...state.collection].map((item) => (
        <Option
          key={item.key}
          item={item}
          state={state}
          dropState={dropState}
        />
      ))}
    </ul>
  );
}

function Option({ item, state, dropState }) {
  // Setup listbox option as normal. See useListBox docs for details.
  let ref = useRef(null);
  let { optionProps } = useOption({ key: item.key }, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();

  // Register the item as a drop target.
  let { dropProps, isDropTarget } = useDroppableItem(
    {
      target: { type: "item", key: item.key, dropPosition: "on" },
    },
    dropState,
    ref
  );

  // Merge option props and dnd props, and render the item.
  return (
    <>
      <DropIndicator
        target={{ type: "item", key: item.key, dropPosition: "before" }}
        dropState={dropState}
      />
      <li
        {...mergeProps(optionProps, dropProps, focusProps)}
        ref={ref}
        className={`option ${isFocusVisible ? "focus-visible" : ""} ${
          isDropTarget ? "drop-target" : ""
        }`}
      >
        {item.rendered}
      </li>
      {state.collection.getKeyAfter(item.key) == null && (
        <DropIndicator
          target={{ type: "item", key: item.key, dropPosition: "after" }}
          dropState={dropState}
        />
      )}
    </>
  );
}

const Card = ({
  title,
  ...divParams
}: { title: string } & HtmlHTMLAttributes<HTMLDivElement>) => {
  let { dragProps, isDragging } = useDrag({
    getItems() {
      return [
        {
          "text/plain": "hello world",
          "my-app-custom-type": JSON.stringify({ message: "hello world" }),
        },
      ];
    },
  });
  return (
    <div
      {...dragProps}
      className="bg-white dark:bg-neutral-900 shadow-xl p-5 max-w-80 rounded-lg cursor-pointer"
      {...divParams}
    >
      <div className=" flex items-center justify-between">
        <p className=" bg-lime-200/60 text-lime-500 dark:bg-lime-600 dark:text-lime-100 inline-block px-1.5 py-0.5 rounded-lg text-xs">
          Low
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 dark:text-neutral-100"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold mt-1 dark:text-white">{title}</h3>
      <p className="text-neutral-400 dark:text-neutral-400 text-xs pr-4 mt-1.5">
        Brainstorming brings team members' diverse experience into play.{" "}
      </p>

      <div className=" flex items-center justify-end mt-7 gap-3">
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 text-stone-500 dark:text-neutral-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          <p className=" text-xs text-stone-500 dark:text-neutral-100">
            12 comments
          </p>
        </div>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 text-stone-500 dark:text-neutral-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
            />
          </svg>
          <p className=" text-xs text-stone-500 dark:text-neutral-100">
            2 files
          </p>
        </div>
      </div>
    </div>
  );
};
export default DashboardARIA;
