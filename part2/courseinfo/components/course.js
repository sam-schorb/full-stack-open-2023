import React from 'react';

const Header = ({course}) => {
  return (
    <div>
      <h1>{course}</h1>
    </div>
  )
}

const Content = ({ parts }) => (
  <div>
    {parts.map(({ name, exercises }, index) => (
      <Part key={index} part={name} exercises={exercises} />
    ))}
  </div>
);


const Part = ({ part, exercises }) => (
  <p>
    {part} {exercises}
  </p>
);


const Total = ({ parts }) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
  console.log({ totalExercises });
  return (
    <div>
      <b>Number of exercises {totalExercises}</b>
    </div>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
