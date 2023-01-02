import React from 'react'
import { Todo } from '../../../typings'
import { notFound } from 'next/navigation'

export const dynamicParams = true

type PageProps = {
    params: {
        todoId: string
    }
}

const fetchTodo = async (todoId: string) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
        //ISR - Incremental Static Regeneration
        // https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration
        { next: { revalidate: 60 } }
    )
    const todo: Todo = await response.json()
    console.log(todo)
    return todo
}


async function TodoPage({ params: { todoId } }: PageProps) {
    const todo = await fetchTodo(todoId);

    if (!todo.id) return notFound()

    return (
        <div>TodoPage: {todoId}
            <p>Completed; {todo.completed ? "Yes" : "No"}</p>

            <p>By User: {todo.userId}</p>
            <p>Title: {todo.title}</p>
        </div>

    )
}

export default TodoPage

// get all the todos
// return an array of objects of the form {todoId: '1'}
// related to the ISR - Incremental Static Regeneration
// to render the page quickly
export async function generateStaticParams() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    const todos: Todo[] = await response.json()

    //  DEMO: only return the first 10 todos
    const trimmedTodos = todos.slice(0, 10)

    return trimmedTodos.map((todo) => ({
        todoId: todo.id.toString()
    }))

    // [{todoId: '1'}, {todoId: '2'}, {todoId: '3'}, .... ]
}