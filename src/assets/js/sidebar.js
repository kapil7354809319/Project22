setTimeout(() => {
  const SELECTOR_PUSHMENU_BTN = '[data-widget="pushmenu1"]';
  const SELECTOR_PUSHMENU_ICON = '[data-widget="pushmenuicon"]';
  const SIDEBAR_MENU = '[data-widget="main-sidebar"]';
  const SIDEBAR_CONTENT = '[data-widget="main-content"]';
  const TOP_NAVBAR = '[data-widget="main-top-navbar"]';

  var toggle = false;

  $(SELECTOR_PUSHMENU_BTN).on('click', function () {
    toggle = !toggle;

    // console.log("width -", toggle)
    if (toggle) {
      $(SIDEBAR_MENU).animate({ width: 0 });
      $(SIDEBAR_CONTENT).animate({ marginLeft: 0 });
      $(TOP_NAVBAR).animate({ marginLeft: 0 });
      $(SELECTOR_PUSHMENU_ICON).attr("src", "assets/images/svg/menu-icon-to-expand.svg");
    }
    else {
      $(SIDEBAR_MENU).animate({ width: 250 });
      $(SIDEBAR_CONTENT).animate({ marginLeft: 250 });
      $(TOP_NAVBAR).animate({ marginLeft: 250 });
      $(SELECTOR_PUSHMENU_ICON).attr("src", "assets/images/svg/menu-icon-to-collaspe.svg");
    }

  });


  // $(".panel-heading .heading").each((i, el)=>{
  //   el.innerText = fixCapitalsText(el.innerText);
  // })

  // $(".panel-subheading .subheading").each((i, el)=>{
  //   el.innerText = fixCapitalsText(el.innerText);
  // })

  let headerSticky = document.getElementById("stickyHeader");
  let sticky = headerSticky ? headerSticky?.offsetTop : null;

  function stickyFunction() {
    // console.log("sticky function ", window.pageYOffset, sticky, headerSticky)
    let sidebar = document.getElementById("main-sidebar");
    if (sidebar) {
    if (window.scrollY > (sticky)) {

      if (document.getElementById("main-sidebar").clientWidth < 50) {
        // console.log("sticky", document.getElementById("main-sidebar").clientWidth)
        headerSticky.classList.add("full-sticky-header");
      } else {
        headerSticky.classList.add("sticky-header");
      }
      // document.getElementById("restPage").style.marginTop = "80px";
    } else {
      headerSticky.classList.remove("sticky-header");
      headerSticky.classList.remove("full-sticky-header");
      // document.getElementById("restPage").style.marginTop = "0px";
    }
    }
  }

  window.onscroll = function () { stickyFunction() };

}, 500);