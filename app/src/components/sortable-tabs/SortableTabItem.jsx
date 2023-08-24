import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS as cssDndKit } from "@dnd-kit/utilities";

export const SortableTabItem = ({ id, activeId }) => {
  const { setNodeRef, transform, transition, listeners } = useSortable({ id });

  const style = {
    transform: cssDndKit.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      className={
        activeId === id ? "sortable-item dragging-dbd-kit" : "sortable-item"
      }
    >
      <span>Item {id}</span>
    </li>
  );
};
