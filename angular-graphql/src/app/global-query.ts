import gql from 'graphql-tag';

export const createTodo = gql`
  mutation createTodo($content: String!) {
    createTodo(content: $content) {
      _id,
      content,
      done
    }
  }`;

export const todos = gql`
  query {
    todo {
      _id
      content
      done
    }
  }`;

export const todo = gql`
  query todo($id: String!) {
    todo(_id: $id) {
        _id,
        content,
        done
    }
  }`;

export const deleteTodo = gql`
  mutation deleteTodo($id: String!) {
    deleteTodo(_id: $id) {
      _id,
      content,
      done
    }
  }`;

export const checkTodo = gql`
  mutation checkTodo($id: String!) {
    checkTodo(_id: $id) {
      _id,
      content,
      done
    }
  }`;
