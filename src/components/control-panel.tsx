import React, { FunctionComponent } from 'react'
import { toString } from 'lodash'

export type SliderInput = React.ChangeEvent<HTMLInputElement>

type InputObj = { fn: (e: SliderInput) => void; value: number }

interface InputProps {
  deal: InputObj
  min: number
  max: number
  title: string
  className?: string
  step?: number
}

interface ControlProps {
  className?: string
  handleReset: () => void
  handleRecompute: () => void
  handleFactor: InputObj
  handleMagn: InputObj
  handleIter: InputObj
  handleClickF: InputObj
}

const Input: FunctionComponent<InputProps> = ({ deal, title, className, min, max, step }) => (
  <div className={`mv2 ${className}`}>
    <span style={{ userSelect: 'none' }} className="mh2">
      {title}
    </span>
    <input onChange={deal.fn} step={step} type="range" min={min} max={max} value={deal.value} />
    <span style={{ userSelect: 'none' }} className="mh2">{`current: ${deal.value}`}</span>
  </div>
)

export const ControlPanel: FunctionComponent<ControlProps> = props => (
  <div className={`flex flex-column ma2 pa3 align-between ${props.className}`}>
    {/* Recompute */}
    <button
      className="h2 w5 mv2"
      onClick={props.handleRecompute}
      style={{ userSelect: 'none' }}
    >{`Recompute`}</button>
    <button
      className="h2 w5 mv2"
      onClick={props.handleReset}
      style={{ userSelect: 'none' }}
    >{`Reset size`}</button>
    {/* ------- */}
    {/* Inputs */}
    <Input
      className="mv2"
      deal={props.handleFactor}
      title={'Stretching scale factor'}
      min={0.4}
      max={3}
      step={0.1}
    />
    <Input
      className="mv2"
      step={0.05}
      deal={props.handleClickF}
      title={'Scaling factor'}
      min={0.05}
      max={1}
    />
    <Input className="mv2" deal={props.handleMagn} title={'Max magnitude'} min={1} max={1000} />
    <Input className="mv2" deal={props.handleIter} title={'Max iterations'} min={5} max={1000} />
  </div>
)
