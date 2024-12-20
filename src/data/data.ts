export const questions = [
    {
        id: 1,
        question: 'З ким ви хочете отримати розлучення?',
        options: [
            {value: 'З чоловіком', label: 'З чоловіком', name:'divorce',type:'radio'},
            {value: 'З жінкою', label: 'З жінкою', name:'divorce',type:'radio'}
        ]
    },
    {
        id: 2,
        question: 'Де зараз заходиться',
        options: [
            {value: 'В Україні', label: 'В Україні', name: 'location',type:'radio'},
            {value: 'За кордоном', label: 'За кордоном', name: 'location',type:'radio'},
        ]
    },
    {
        id: 3,
        question: 'Чи маєте ви неповнолітніх дітей?',
        options: [
            {value: 'так', label: 'Так', name: 'children',type:'radio'},
            {value: 'ні', label: 'Ні', name: 'children',type:'radio'},
        ]
    },
    {
        id: 4,
        question: 'Чи потрібно вам оформлення розподілу спільного майна?',
        options: [
            {value: 'так', label: 'Так, потрібно', name: 'maino',type:'radio'},
            {value: 'ні', label: 'Ні', name: 'maino',type:'radio'},
            {value: 'потрібна консультація', label: 'Потрібна консультація', name: 'maino',type:'radio'}
        ]
    },
    {
        id: 5,
        question: 'Вкажіть з якого ви міста або населеного пункту',
        options: [{value: '', label: 'Місто', name: 'city', placeholder: 'Наприклад: Київ',type:'text'}]
    },
    {
        id: 6,
        question: '25 років досвіду та понад 2000 успішних справ',
        desc:"Залиште заявку зараз і ми допоможемо зробити перший крок до нового життя!",
        options: [
            {value: '', label: 'Ваше ім\'я', name: 'name' ,type:'text'},
            {value: 'tel', label: 'Телефон', name: 'tel' ,type:'text'}
        ]
    }
];