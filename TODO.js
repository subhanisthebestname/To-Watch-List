console.log('Script Running')
document.addEventListener('DOMContentLoaded',load)
document.getElementById('add-task-btn').addEventListener('click',addTask)
document.getElementById('task-list').addEventListener('click',handletasks)
document.querySelectorAll('.filter-btn').forEach(btn =>btn.addEventListener('click',filterTasks))

function addTask(){
	let inpitem = document.getElementById('new-task')
	let inpvalue = inpitem.value.trim();
	if(inpvalue === '') return;
	let tasks = loadtasksfromstorage()
	let task = {text:inpvalue, completed:false}
	tasks.push(task)
	saveTasksToStorage(tasks)
	inpitem.value = ''
	renderTasks();
}
// Now we will handle edit/delete tasks:
function handletasks(e){
	if(e.target.classList.contains('edit-btn')){
		editTask(e.target)
	}else if(e.target.classList.contains('delete-btn')){
		deleteTask(e.target)
	}else if(e.target.classList.contains('task-text')){
		toggleTaskCompletion(e.target)
	}
}

function editTask(button){
	let taskitem = button.parentElement.parentElement;
	let text = taskitem.querySelector('.task-text').innerText;
	let index = Array.from(taskitem.parentElement.children).indexOf(taskitem)
	let newtext = prompt('',text)
	let tasks = loadtasksfromstorage()
	if(newtext.trim() !== '' && newtext !== null){
		tasks[index].text = newtext
		saveTasksToStorage(tasks)
        renderTasks();
	}
}
function deleteTask(button){
	let taskItem = button.parentElement.parentElement;
	let index = Array.from(taskItem.parentElement.children).indexOf(taskItem);
	let tasks = loadtasksfromstorage()
	tasks.splice(index,1)
	saveTasksToStorage(tasks)
    renderTasks()

}
function toggleTaskCompletion(button){
	let taskitem = button.parentElement;
	let index = Array.from(taskitem.parentElement.children).indexOf(taskitem)
	let tasks = loadtasksfromstorage()
	// console.log(index)
	// console.log(tasks[index])
	tasks[index].completed = !tasks[index].completed
	saveTasksToStorage(tasks)
	renderTasks()
}
// loading and saving from localstorage:
function loadtasksfromstorage(){
	return JSON.parse(localStorage.getItem('tasks') || []);
}
function saveTasksToStorage(tasks){
	(localStorage.setItem('tasks',JSON.stringify(tasks)))
}
//

// Handling All/completed/pending :
function filterTasks(e){
	document.querySelectorAll('.filter-btn').forEach(btn=> btn.classList.remove('active'))
	e.target.classList.add('active')
	renderTasks()
}
//
function renderTasks(){
	let tasks = loadtasksfromstorage()
	let filter = document.querySelector('.filter-btn.active').getAttribute('data-filter')
	let tasklist = document.getElementById('task-list')
	tasklist.innerHTML = '';
	tasks.forEach((task) =>{
		if(filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'pending' && !task.completed)){
			let taskitem = document.createElement('li')
			taskitem.classList.add('task-item')
			if(task.completed) taskitem.classList.add('completed');

			let span = document.createElement('span')
			span.classList.add('task-text')
			span.innerText = task.text;
			let buttondiv = document.createElement('div')
			buttondiv.classList.add('task-buttons')
			buttondiv.innerHTML = `
				<button class="edit-btn">Edit</button>
				<button class="delete-btn">Delete</button>

			`
			tasklist.appendChild(taskitem)
			taskitem.appendChild(span)
			taskitem.appendChild(buttondiv)
		}

	})
}
function load(){
	renderTasks()
}
//