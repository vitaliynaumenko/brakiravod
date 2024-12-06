export const questions = [
    {
        id: 1,
        question: 'З ким ви хочете отримати розлучення?',
        options: [
            {value: 'З чоловіком', label: 'З чоловіком', name:'divorce'},
            {value: 'З жінкою', label: 'З жінкою', name:'divorce'}
        ]
    },
    {
        id: 2,
        question: 'Де зараз заходиться',
        options: [
            {value: 'В Україні', label: 'В Україні', name: 'location'},
            {value: 'За кордоном', label: 'За кордоном', name: 'location'},
        ]
    },
    {
        id: 3,
        question: 'Чи маєте ви неповнолітніх дітей?',
        options: [
            {value: 'так', label: 'Так', name: 'children'},
            {value: 'ні', label: 'Ні', name: 'children'},
        ]
    },
    {
        id: 4,
        question: 'Чи потрібно вам оформлення розподілу спільного майна?',
        options: [
            {value: 'так', label: 'Так, потрібно', name: 'maino'},
            {value: 'ні', label: 'Ні', name: 'maino'},
            {value: 'потрібна консультація', label: 'Потрібна консультація', name: 'maino'}
        ]
    },
    {
        id: 5,
        question: 'Вкажіть з якого ви міста або населеного пункту',
        options: [{value: '', label: 'Місто', name: 'city'}]
    },
    {
        id: 6,
        question: 'Наш спеціаліст вже почав розраховувати подання на розірвання шлюбу',
        options: [
            {value: '', label: 'Ваше ім\'я', name: 'name'},
            {value: 'tel', label: 'Телефон', name: 'tel'}
        ]
    }
];