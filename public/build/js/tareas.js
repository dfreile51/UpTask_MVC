!function(){!async function(){try{const t=s(),a=`${location.origin}/api/tareas?id=${t}`,o=await fetch(a),r=await o.json();e=r.tareas,n()}catch(e){console.log(e)}}();let e=[],t=[];const a={0:"Pendiente",1:"Completa"};document.querySelector("#agregar-tarea").addEventListener("click",()=>{r()});function o(a){const o=a.target.value;t=""!==o?e.filter(e=>e.estado===o):[],n()}function n(){!function(){const e=document.querySelector("#listado-tareas");for(;e.firstChild;)e.removeChild(e.firstChild)}(),function(){const t=e.filter(e=>"0"===e.estado),a=document.querySelector("#pendientes");0===t.length?a.disabled=!0:a.disabled=!1}(),function(){const t=e.filter(e=>"1"===e.estado),a=document.querySelector("#completadas");0===t.length?a.disabled=!0:a.disabled=!1}();const o=t.length?t:e;if(0!==o.length)o.forEach(t=>{const{id:o,nombre:c,estado:d}=t,l=document.createElement("LI");l.dataset.tareaId=o,l.classList.add("tarea");const u=document.createElement("P");u.textContent=c,u.ondblclick=function(){r(!0,{...t})};const m=document.createElement("DIV");m.classList.add("opciones");const p=document.createElement("BUTTON");p.classList.add("estado-tarea"),p.classList.add(""+a[d].toLowerCase()),p.textContent=a[d],p.dataset.estadoTarea=d,p.ondblclick=function(){!function(e){const t="1"===e.estado?"0":"1";e.estado=t,i(e)}({...t})};const f=document.createElement("BUTTON");f.classList.add("eliminar-tarea"),f.dataset.idTarea=o,f.textContent="Eliminar",f.ondblclick=function(){!function(t){Swal.fire({title:"¿Eliminar Tarea?",showCancelButton:!0,confirmButtonText:"Si",cancelButtonText:"No",customClass:{popup:"sweet-container"}}).then(a=>{a.isConfirmed&&async function(t){const{estado:a,id:o,nombre:r}=t,c=new FormData;c.append("id",o),c.append("nombre",r),c.append("estado",a),c.append("proyectoId",s());try{const a=location.origin+"/api/tarea/eliminar",o=await fetch(a,{method:"POST",body:c}),r=await o.json();r.resultado&&(Swal.fire({title:"Eliminado!",text:r.mensaje,icon:"success",customClass:{popup:"sweet-container-success"}}),e=e.filter(e=>e.id!==t.id),n())}catch(e){console.log(e)}}(t)})}({...t})},m.appendChild(p),m.appendChild(f),l.appendChild(u),l.appendChild(m);document.querySelector("#listado-tareas").appendChild(l)});else{const e=document.createElement("LI");e.textContent="No Hay Tareas",e.classList.add("no-tareas");document.querySelector("#listado-tareas").appendChild(e)}}function r(t=!1,a={}){const o=document.createElement("DIV");o.classList.add("modal"),o.innerHTML=`\n            <form class="formulario nueva-tarea">\n                <legend>${t?"Editar Tarea":"Añade una nueva tarea"}</legend>\n                <div class="campo">\n                    <label for="tarea">Tarea</label>\n                    <input type="text" name="tarea" placeholder="${t?"Edita la Tarea":"Añadir Tarea al proyecto actual"}" id="tarea" value = "${a.nombre?a.nombre:""}">\n                </div>\n                <div class="opciones">\n                    <input type="submit" class="submit-nueva-tarea" value="${t?"Guardar Cambios":"Añadir Tarea"}">\n                    <button type="buton" class="cerrar-modal">Cancelar</button>\n                </div>\n            </form>\n        `,setTimeout(()=>{document.querySelector(".formulario").classList.add("animar")},0),o.addEventListener("click",(function(r){if(r.preventDefault(),r.target.classList.contains("cerrar-modal")){document.querySelector(".formulario").classList.add("cerrar"),setTimeout(()=>{o.remove()},500)}if(r.target.classList.contains("submit-nueva-tarea")){const o=document.querySelector("#tarea").value.trim();if(""===o)return void c("El Nombre de la tarea es Obligatorio","error",document.querySelector(".formulario legend"));t?(a.nombre=o,i(a)):async function(t){const a=new FormData;a.append("nombre",t),a.append("proyectoId",s());try{const o=location.origin+"/api/tarea",r=await fetch(o,{method:"POST",body:a}),i=await r.json();if(c(i.mensaje,i.tipo,document.querySelector(".formulario legend")),"exito"===i.tipo){const a=document.querySelector(".modal");setTimeout(()=>{a.remove()},3e3);const o={id:String(i.id),nombre:t,estado:"0",proyectoId:i.proyectoId};e=[...e,o],n()}}catch(e){console.log(e)}}(o)}})),document.querySelector(".dashboard").appendChild(o)}function c(e,t,a){const o=document.querySelector(".alerta");o&&o.remove();const n=document.createElement("DIV");n.classList.add("alerta",t),n.textContent=e,a.parentElement.insertBefore(n,a.nextElementSibling),setTimeout(()=>{n.remove()},5e3)}async function i(t){const{estado:a,id:o,nombre:r}=t,c=new FormData;c.append("id",o),c.append("nombre",r),c.append("estado",a),c.append("proyectoId",s());try{const t=location.origin+"/api/tarea/actualizar",i=await fetch(t,{method:"POST",body:c}),s=await i.json();if("exito"===s.respuesta.tipo){Swal.fire({title:"Actualizado!",text:s.respuesta.mensaje,icon:"success",customClass:{popup:"sweet-container-success"}});const t=document.querySelector(".modal");t&&t.remove(),e=e.map(e=>(e.id===o&&(e.estado=a,e.nombre=r),e)),n()}}catch(e){console.log(e)}}function s(){const e=new URLSearchParams(window.location.search);return Object.fromEntries(e.entries()).id}document.querySelectorAll("#filtros input[type='radio']").forEach(e=>{e.addEventListener("input",o)})}();