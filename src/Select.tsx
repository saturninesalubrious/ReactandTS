import styles from "./select.module.css"
import { useEffect, useRef, useState } from "react"

type SelectOption = {
 label: string
 value: string | number
}

type MultiSelectProps = {
 multiple: true
 onChange: (value: SelectOption[]) => void;
 value: SelectOption[]
}

type SingleSelectProps = {
 multiple?: false
 onChange: (value: SelectOption | undefined) => void;
 value: SelectOption | undefined
}

type SelectProps = {
 options: SelectOption[]
} & (MultiSelectProps | SingleSelectProps)

function Select({ multiple, options, value, onChange }: SelectProps) {
const [isOpen, setIsOpen] = useState(false)
const [highlightedIndex, setHighlightedIndex] = useState(0)
const containerRef = useRef<HTMLDivElement | null>(null)

function clearOptions(){
 multiple? onChange([]) : onChange(undefined)
}

function isOptionSelected(option: SelectOption){
return multiple? (value.includes(option)) : (value === option)
}

function selectOption(option: SelectOption) {
 if(multiple){
  if (value.includes(option)){
   onChange(value.filter(val => option !== val))
  } else  {
   onChange ([...value, option])
  }
 } else{
  if(value !== option) onChange(option)
 }
}


useEffect(() => {
 const handler = (e: KeyboardEvent) => {
   if (e.target != containerRef.current) return
   switch (e.code) {
     case "Enter":
     case "Space":
       setIsOpen(prev => !prev)
       if (isOpen) selectOption(options[highlightedIndex])
       break
     case "ArrowUp":
     case "ArrowDown": {
       if (!isOpen) {
         setIsOpen(true)
         break
       }

       const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
       if (newValue >= 0 && newValue < options.length) {
         setHighlightedIndex(newValue)
       }
       break
     }
     case "Escape":
       setIsOpen(false)
       break
   }
 }
 containerRef.current?.addEventListener("keydown", handler)

 return () => {
   containerRef.current?.removeEventListener("keydown", handler)
 }
}, [isOpen, highlightedIndex, options])
  return (
    <div ref={containerRef} onBlur={() => setIsOpen(false)} onClick={() => setIsOpen(prev => !prev)} tabIndex={0} className={styles.container}>
     <span className={styles.value}>{multiple? value.map(v => (
      <button key={v.value} onClick={e => 
       {e.stopPropagation()
        selectOption(v)
      }}
      className={styles["option-badge"]}
      >{v.label}
      <span className={styles["remove-btn"]}>&times;</span></button>
     )
     ) :value?.label}</span>
     <button onClick={(e) => {
      e.stopPropagation()
      clearOptions()
     }} className={styles["clear-btn"]}>&times;</button>
     <div className={styles.divider}></div>
     <div className={styles.caret}></div>
     <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
      {options.map((option, index) => 
       <li  onMouseEnter={() =>
        setHighlightedIndex(index)
       } onClick={e => {
        selectOption(option)
        
        e.stopPropagation()
       
        selectOption(option)
        setIsOpen(false)
       }} key={option.value} className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""} ${index === highlightedIndex ? styles.highlighted : ""}`}>{option.label}</li>

      )}
     </ul>
    </div>
  )
}

export  {Select, type SelectOption}
