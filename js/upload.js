// ======================================================
// upload.js
// PART - 1
// ======================================================

// ---------------------------
// Supabase Client
// ---------------------------

const SUPABASE_URL =
"https://kdjouagibqusxdwsebhx.supabase.co";

const SUPABASE_KEY =
"sb_publishable_uN83f82g2EOYny5m9ZiQAw_xKaYxAS7";

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

// ---------------------------
// Elements
// ---------------------------

const uploadForm =
document.getElementById("uploadForm");

const uploadVideoForm =
document.getElementById("uploadVideoForm");

const uploadButton =
document.querySelector(
"#uploadForm button[type='submit']"
);

const uploadVideoButton =
document.querySelector(
"#uploadVideoForm button[type='submit']"
);

// ---------------------------
// Loading
// ---------------------------

function startLoading(button,text){

if(!button) return;

button.disabled=true;

button.dataset.oldText=
button.innerHTML;

button.innerHTML=

`
<span>

${text}

</span>

`;

}

// ---------------------------
// Stop Loading
// ---------------------------

function stopLoading(button){

if(!button) return;

button.disabled=false;

button.innerHTML=

button.dataset.oldText;

}

// ---------------------------
// Success Message
// ---------------------------

function success(message){

alert(message);

}

// ---------------------------
// Error Message
// ---------------------------

function failed(error){

alert(error);

}

// ---------------------------
// Create File Name
// ---------------------------

function createFileName(file){

const extension=

file.name
.split(".")
.pop();

return

Date.now()

+

"-"

+

Math.random()
.toString(36)
.substring(2,8)

+

"."

+

extension;

}

// ---------------------------
// Public URL
// ---------------------------

function getPublicUrl(path){

return

supabase

.storage

.from("notes")

.getPublicUrl(path)

.data

.publicUrl;

}

// ======================================================
// PART - 2 CONTINUE...
// ======================================================
// ======================================================
// PART - 2
// Notes Upload
// ======================================================

async function uploadNote(event){

event.preventDefault();

try{

startLoading(uploadButton,"Uploading...");

const title=

document
.getElementById("title")
.value
.trim();

const file=

document
.getElementById("file-upload")
.files[0];

if(title===""){

throw new Error("Enter Title");

}

if(!file){

throw new Error("Select PDF");

}

const fileName=

createFileName(file);

const{

error:uploadError

}

=

await supabase

.storage

.from("notes")

.upload(

fileName,

file,

{

upsert:false

}

);

if(uploadError){

throw uploadError;

}

const pdfUrl=

getPublicUrl(fileName);

const{

error:insertError

}

=

await supabase

.from("notes")

.insert([

{

title:title,

pdf_url:pdfUrl

}

]);

if(insertError){

throw insertError;

}

uploadForm.reset();

success("Notes Uploaded Successfully");

}

catch(error){

failed(error.message);

}

finally{

stopLoading(uploadButton);

}

}

// -----------------------------

if(uploadForm){

uploadForm

.addEventListener(

"submit",

uploadNote

);

}

// ======================================================
// PART - 3 CONTINUE...
// ======================================================
// ======================================================
// PART - 3
// YouTube Video Upload
// ======================================================

async function uploadVideo(event){

event.preventDefault();

try{

startLoading(uploadVideoButton,"Uploading...");

const title=
document
.getElementById("videoTitle")
.value
.trim();

const youtubeUrl=
document
.getElementById("youtubeUrl")
.value
.trim();

const description=
document
.getElementById("videoDescription")
.value
.trim();

if(title===""){

throw new Error("Enter Video Title");

}

if(youtubeUrl===""){

throw new Error("Enter YouTube Link");

}

const{

error:insertError

}

=

await supabase

.from("videos")

.insert([

{

title:title,

youtube_url:youtubeUrl,

description:description

}

]);

if(insertError){

throw insertError;

}

uploadVideoForm.reset();

success("Video Uploaded Successfully");

}

catch(error){

failed(error.message);

}

finally{

stopLoading(uploadVideoButton);

}

}

// --------------------------------------------------
// Upload Video Form
// --------------------------------------------------

if(uploadVideoForm){

uploadVideoForm

.addEventListener(

"submit",

uploadVideo

);

}

// --------------------------------------------------
// YouTube URL Validation
// --------------------------------------------------

function isValidYoutubeUrl(url){

const pattern=

/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

return pattern.test(url);

}

// --------------------------------------------------
// Extract YouTube Video ID
// --------------------------------------------------

function getYoutubeId(url){

if(url.includes("watch?v=")){

return url

.split("watch?v=")[1]

.split("&")[0];

}

if(url.includes("youtu.be/")){

return url

.split("youtu.be/")[1]

.split("?")[0];

}

if(url.includes("/shorts/")){

return url

.split("/shorts/")[1]

.split("?")[0];

}

return "";

}

// --------------------------------------------------
// Auto Preview Thumbnail
// --------------------------------------------------

const youtubeInput=

document.getElementById("youtubeUrl");

const previewImage=

document.getElementById("youtubePreview");

if(youtubeInput && previewImage){

youtubeInput.addEventListener("input",()=>{

const id=

getYoutubeId(

youtubeInput.value

);

if(id){

previewImage.src=

`https://img.youtube.com/vi/${id}/hqdefault.jpg`;

previewImage.style.display="block";

}else{

previewImage.style.display="none";

}

});

}

// ======================================================
// PART - 4 CONTINUE...
// ======================================================
// ======================================================
// PART - 4
// Common Functions
// ======================================================

// ----------------------------
// Delete Note
// ----------------------------

async function deleteNote(id){

const ok=

confirm("Delete this Note?");

if(!ok) return;

try{

const {error}=

await supabase

.from("notes")

.delete()

.eq("id",id);

if(error) throw error;

success("Note Deleted");

location.reload();

}catch(error){

failed(error.message);

}

}

// ----------------------------
// Delete Video
// ----------------------------

async function deleteVideo(id){

const ok=

confirm("Delete this Video?");

if(!ok) return;

try{

const {error}=

await supabase

.from("videos")

.delete()

.eq("id",id);

if(error) throw error;

success("Video Deleted");

location.reload();

}catch(error){

failed(error.message);

}

}

// ----------------------------
// Update Note
// ----------------------------

async function updateNote(

id,

title

){

try{

const {error}=

await supabase

.from("notes")

.update({

title:title

})

.eq("id",id);

if(error) throw error;

success("Note Updated");

}catch(error){

failed(error.message);

}

}

// ----------------------------
// Update Video
// ----------------------------

async function updateVideo(

id,

title,

youtubeUrl,

description

){

try{

const {error}=

await supabase

.from("videos")

.update({

title:title,

youtube_url:youtubeUrl,

description:description

})

.eq("id",id);

if(error) throw error;

success("Video Updated");

}catch(error){

failed(error.message);

}

}

// ----------------------------
// Read Notes
// ----------------------------

async function getNotes(){

const {data,error}=

await supabase

.from("notes")

.select("*")

.order(

"created_at",

{

ascending:false

}

);

if(error){

failed(error.message);

return [];

}

return data;

}

// ----------------------------
// Read Videos
// ----------------------------

async function getVideos(){

const {data,error}=

await supabase

.from("videos")

.select("*")

.order(

"created_at",

{

ascending:false

}

);

if(error){

failed(error.message);

return [];

}

return data;

}

// ----------------------------
// Search Notes
// ----------------------------

function searchNotes(

notes,

keyword

){

return notes.filter(note=>

note.title

.toLowerCase()

.includes(

keyword

.toLowerCase()

)

);

}

// ----------------------------
// Search Videos
// ----------------------------

function searchVideos(

videos,

keyword

){

return videos.filter(video=>

video.title

.toLowerCase()

.includes(

keyword

.toLowerCase()

)

);

}

// ======================================================
// upload.js END
// ======================================================
