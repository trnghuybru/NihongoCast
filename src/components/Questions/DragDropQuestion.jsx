"use client"

import React, { useState, useEffect } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const ItemType = "ITEM"

const DraggableItem = ({ id, text, index, moveItem, isCorrect, isReview = false }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isReview,
  })

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (!isReview) {
        const dragIndex = item.index
        const hoverIndex = index

        if (dragIndex === hoverIndex) {
          return
        }

        moveItem(dragIndex, hoverIndex)
        item.index = hoverIndex
      }
    },
  })

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-3 mb-2 border rounded-md cursor-move transition-colors ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${
        isReview && isCorrect !== undefined
          ? isCorrect
            ? "border-green-500 bg-green-50"
            : "border-red-500 bg-red-50"
          : "border-gray-200 hover:border-orange-300"
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {text}
      {isReview && isCorrect && <span className="ml-2 text-green-600">✓</span>}
      {isReview && isCorrect === false && <span className="ml-2 text-red-600">✗</span>}
    </div>
  )
}

const DragDropQuestion = ({ question, onAnswer, userAnswer = [], isReview = false }) => {
  const initialItems =
    userAnswer.length > 0
      ? userAnswer
          .map((id) => question.options?.find((opt) => opt.id === id))
          .filter(Boolean)
      : [...(question.options || [])].sort(() => Math.random() - 0.5)

  const [items, setItems] = useState(initialItems)

  useEffect(() => {
    const answerIds = items.map((item) => item.id)
    onAnswer(question.id, answerIds)
  }, [items, question.id, onAnswer])

  const moveItem = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex]
    const newItems = [...items]
    newItems.splice(dragIndex, 1)
    newItems.splice(hoverIndex, 0, dragItem)
    setItems(newItems)
  }

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-3">{question.text}</h3>
      <p className="mb-4 text-gray-600">Drag the items to arrange them in the correct order.</p>

      <DndProvider backend={HTML5Backend}>
        <div>
          {items.map((item, index) => {
            const isCorrect = isReview ? question.options && question.options[index]?.id === item.id : undefined

            return (
              <DraggableItem
                key={item.id}
                id={item.id}
                text={item.text}
                index={index}
                moveItem={moveItem}
                isCorrect={isCorrect}
                isReview={isReview}
              />
            )
          })}
        </div>
      </DndProvider>

      {isReview && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <h4 className="font-medium text-green-800 mb-1">Correct Order:</h4>
          <ol className="list-decimal pl-5">
            {question.options?.map((option) => (
              <li key={option.id} className="mb-1">
                {option.text}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default DragDropQuestion
