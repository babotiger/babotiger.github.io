// 핵심 데이터들을 담을 배열 (로컬 스토리지와 동기화됨)
let studentList = [];

// 페이지가 처음 열렸을 때 실행되는 초기화 이벤트
document.addEventListener('DOMContentLoaded', () => {
    // 1. 로컬 스토리지에서 기존 데이터 가져오기
    const savedData = localStorage.getItem('myClassStudents');
    
    if (savedData) {
        // 문자열 상태인 데이터를 다시 JS 배열 객체로 변환
        studentList = JSON.parse(savedData);
        
        // 저장되어 있던 학생들을 화면에 순서대로 뿌려주기
        // (배열의 뒤쪽 데이터가 최신이므로 역순으로 돌리거나 정렬 처리 가능하지만, 저장 순서대로 표시)
        studentList.forEach(student => {
            renderStudentCard(student);
        });
    }
    // 2. 인원수 카운터 업데이트
    updateStudentCount();
});

// 폼 제출 이벤트 처리
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('studentName').value;
    const log = document.getElementById('studentLog').value;
    const photoFile = document.getElementById('studentPhoto').files[0];

    if (photoFile) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const imageUrl = event.target.result;

            // 고유 ID 생성을 위해 현재 시간(밀리초) 사용
            const studentId = Date.now();

            // 학생 데이터 객체 만들기
            const newStudent = {
                id: studentId,
                name: name,
                log: log,
                image: imageUrl
            };

            // 배열에 추가하고 화면에 그리기
            studentList.push(newStudent);
            renderStudentCard(newStudent);

            // 로컬 스토리지에 최종 저장 및 카운터 갱신
            saveToLocalStorage();
            updateStudentCount();

            // 폼 입력창 초기화
            document.getElementById('studentForm').reset();
        };

        reader.readAsDataURL(photoFile);
    }
});

// 데이터를 화면(DOM)에 카드로 만들어 붙이는 함수
function renderStudentCard(student) {
    const grid = document.getElementById('studentGrid');

    const card = document.createElement('div');
    card.className = 'student-card';
    card.setAttribute('data-id', student.id); // 삭제할 때 식별하기 위해 고유 ID 심어두기

    card.innerHTML = `
        <button class="delete-btn" onclick="deleteStudent(${student.id})">×</button>
        <div class="card-img-container">
            <img src="${student.image}" alt="${student.name} 학생 사진">
        </div>
        <div class="card-content">
            <div class="card-name">${student.name}</div>
            <p class="card-log">${student.log}</p>
        </div>
    `;

    // 최신 글이 맨 위(앞)에 오도록 세팅
    grid.insertBefore(card, grid.firstChild);
}

// 학생 카드 삭제 함수
function deleteStudent(id) {
    if (confirm("정말 이 학생의 기록을 삭제하시겠습니까?")) {
        // 1. 배열에서 해당 id를 가진 데이터 필터링(제외)
        studentList = studentList.filter(student => student.id !== id);

        // 2. 로컬 스토리지 업데이트
        saveToLocalStorage();

        // 3. HTML 화면에서 해당 카드 엘리먼트 찾아 지우기
        const cardToReset = document.querySelector(`[data-id="${id}"]`);
        if (cardToReset) {
            cardToReset.remove();
        }

        // 4. 인원수 카운터 갱신
        updateStudentCount();
    }
}

// 로컬 스토리지 저장 유틸리티 함수
function saveToLocalStorage() {
    localStorage.setItem('myClassStudents', JSON.stringify(studentList));
}

// 총원 카운터 UI 갱신 함수
function updateStudentCount() {
    document.getElementById('studentCount').innerText = studentList.length;
}
