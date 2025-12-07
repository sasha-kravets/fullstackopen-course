const Header = ({ course }) => {
  return <h1>{course.name}</h1>
}

const Part = ({ name, exercises }) => {
  return <p>{name} {exercises}</p>
}

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map(part => 
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      )}
    </div>
  )
}

const Total = ({ course }) => {
  const total = course.parts.reduce((sum, current) => sum + current.exercises, 0);
  return <p><b>total of {total} exercises</b></p>
}

const Course = ({ courses }) => {
  return (
    courses.map(course =>
      <div key={course.id}>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </div>
    )
  ) 
}

export default Course