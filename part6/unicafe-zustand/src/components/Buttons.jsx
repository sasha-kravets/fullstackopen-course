import { useUnicafeControls } from "../store"

const Buttons = () => {
  const { goodClick, neutralClick, badClick } = useUnicafeControls()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={goodClick}>good</button>
      <button onClick={neutralClick}>neutral</button>
      <button onClick={badClick}>bad</button>
    </div>
  )
}

export default Buttons