import './simplebar.min.js'
// document.addEventListener('DOMContentLoaded', () => {
//   // 监听 DOM 变化
//   const observer = new MutationObserver((mutationsList) => {
//     for (const mutation of mutationsList) {
//       if (mutation.type === 'childList') {
//         // 检查是否有目标元素被添加
//         const antTableBodies = document.getElementsByClassName('ant-table-body');
//         const vxeTableBodies = document.getElementsByClassName('vxe-table--body-wrapper body--wrapper');

//         // 处理 ant-table-body
//         for (let i = 0; i < antTableBodies.length; i++) {
//           if (!antTableBodies[i].hasAttribute('data-simplebar')) {
//             antTableBodies[i].setAttribute('data-simplebar', 'init');
//             window.SimpleBar.instances.has(antTableBodies[i]) || new window.SimpleBar(antTableBodies[i], window.SimpleBar.qi(antTableBodies[i].attributes));
//           }
//         }

//         // 处理 vxe-table--body-wrapper
//         for (let i = 0; i < vxeTableBodies.length; i++) {
//           if (!vxeTableBodies[i].hasAttribute('data-simplebar')) {
//             vxeTableBodies[i].setAttribute('data-simplebar', 'init');
//             window.SimpleBar.instances.has(vxeTableBodies[i]) || new window.SimpleBar(vxeTableBodies[i], window.SimpleBar.qi(vxeTableBodies[i].attributes));
//           }
//         }
//       }
//     }
//   });

//   // 监听整个文档的 DOM 变化
//   observer.observe(document.body, { childList: true, subtree: true });
// });