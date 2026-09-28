import React, {useEffect, useRef} from 'react';
import {X} from 'lucide-react';
export default function Modal({title, children, onClose, className=''}) {
  const ref=useRef(null);
  useEffect(()=>{
    const previous=document.activeElement;
    ref.current.showModal();
    return ()=>{previous?.focus();};
  },[]);
  return <dialog ref={ref} className={`modal ${className}`} onCancel={e=>{e.preventDefault();onClose();}} aria-labelledby="modal-title">
    <div className="modal-header"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Fermer" onClick={onClose}><X size={22}/></button></div>
    {children}
  </dialog>;
}
