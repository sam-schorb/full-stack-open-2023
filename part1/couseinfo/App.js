const Header = (props) => {
  console.log(props)
  return (
    <div>
      <h1>{props.course}</h1>
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
      <p>Number of exercises {totalExercises}</p>
    </div>
  )
}


const App = () => {
  const course = 'Half Stack application development';
  const parts = [
    { name: 'Fundamentals of React', exercises: 10 },
    { name: 'Using props to pass data', exercises: 7 },
    { name: 'State of a component', exercises: 14 },
  ];

  return (
    <>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </>
  );
};


export default App;

