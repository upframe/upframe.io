import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

let animFrame = 0
let lastAnimFrame = performance.now()
function render(canvas, vp, ctx, obstacles, player, running = true) {
  vp.h = (canvas.height / canvas.width) * 50
  ctx.lineWidth = devicePixelRatio * 2

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.moveTo(0, vp.transformY(0))
  ctx.lineTo(canvas.width, vp.transformY(0))
  ctx.stroke()
  obstacles.forEach(rect => {
    ctx.beginPath()
    ctx.rect(
      vp.transformX(rect.x),
      vp.transformY(rect.y),
      vp.transformW(rect.w),
      vp.transformH(rect.h)
    )
    ctx.stroke()
  })
  const transform = new DOMMatrix()
    .translate(vp.transformX(player.x - 0.5), vp.transformY(player.y + 1.8))
    .scale((((1 / vp.h) * canvas.height) / 1000) * 1.5)

  if (running) {
    const now = performance.now()
    if (now - lastAnimFrame >= 200) {
      lastAnimFrame = now
      animFrame++
      if (animFrame >= swan.run.length) animFrame = 0
    }
  }

  swan.run[animFrame].forEach(p => {
    const path = new Path2D()
    path.addPath(new Path2D(p), transform)
    ctx.stroke(path)
  })
}

export default function NotFound() {
  const canvasRef = useRef()
  const [started, setStarted] = useState(false)
  const progRef = useRef()

  useEffect(() => {
    if (started) return
    function handleKey(e) {
      if (!['ArrowUp', ' ', 'Enter'].includes(e.key)) return
      setStarted(true)
      window.removeEventListener('keydown', handleKey)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [started])

  useEffect(() => {
    if (!started) return

    const ctx = canvasRef.current.getContext('2d')

    const vp = {
      x: -5,
      y: -5,
      w: 50,
      h: (canvasRef.current.height / canvasRef.current.width) * 50,

      transformX: v => ((v - vp.x) / vp.w) * canvasRef.current.width,
      transformY: v =>
        canvasRef.current.height -
        ((v - vp.y) / vp.h) * canvasRef.current.height,
      transformW: v => (v / vp.w) * canvasRef.current.width,
      transformH: v => (v / vp.h) * -canvasRef.current.height,
    }

    const player = {
      x: 0,
      y: 0,
      w: 1,
      h: 2,
      vel: {
        x: 20,
        y: 0,
      },
      acc: {
        x: 0.5,
        y: -200,
      },
    }

    const obstacles = []
    function generateObstacles() {
      while (obstacles.length < 10) {
        const last = obstacles.slice(-1)[0] || player
        obstacles.push({
          x: last.x + Math.random() * 50 + (last.x > 0 ? 15 : 30),
          y: 0,
          w: 1,
          h: 1.5,
        })
      }
    }
    generateObstacles()

    let run = false
    function update(dt = 1000 / 60) {
      player.vel.x += player.acc.x / (1000 / dt)
      player.vel.y += player.acc.y / (1000 / dt)

      player.x = player.x + (player.vel.x || 0) / (1000 / dt)
      player.y = player.y + (player.vel.y || 0) / (1000 / dt)

      if (player.y <= 0) {
        player.y = 0
        player.vel.y = 0
      }

      vp.x = player.x - 5

      for (const { x, y, w, h } of obstacles) {
        if (x > player.x + player.w) break
        if (
          player.x < x + w &&
          player.x + player.w > x &&
          player.y < y + h &&
          player.y + player.h > y
        )
          run = false
      }

      progRef.current.textContent = Math.round(player.x)

      while (obstacles[0].x + obstacles[0].w <= vp.x) obstacles.shift()
      generateObstacles()
    }

    render(canvasRef.current, vp, ctx, obstacles, player)

    function onKeyDown({ key }) {
      if (['ArrowUp', ' '].includes(key) && player.y <= 0) player.vel.y += 50
    }

    window.addEventListener('keydown', onKeyDown)

    let lastStep = performance.now()
    function step() {
      if (!canvasRef.current) return
      const dt = run ? performance.now() - lastStep : 0
      if (run) update(dt)
      render(canvasRef.current, vp, ctx, obstacles, player, run)
      lastStep = performance.now()
      requestAnimationFrame(step)
    }
    step()
    setTimeout(() => {
      run = true
    }, 1000)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [started])

  useEffect(() => {
    if (!started || !canvasRef.current) return
    const _canvas = canvasRef.current
    const obs = new ResizeObserver(() => {
      _canvas.width = _canvas.offsetWidth * devicePixelRatio
      _canvas.height = _canvas.offsetHeight * devicePixelRatio
    })
    obs.observe(_canvas)
    return () => obs.unobserve(_canvas)
  }, [started])

  if (!started)
    return (
      <S.NotFound>
        <h1>404</h1>
      </S.NotFound>
    )
  return (
    <>
      <S.Canvas ref={canvasRef} />
      <S.Progress ref={progRef}></S.Progress>
    </>
  )
}

const swan = {
  run: [
    [
      'M1200 292C1158 282 1122 273 1117 271C1113 270 1091 264 1087 264C1085 263 1068 259 1049 255C997 242 997 242 969 298C960 315 955 326 948 338C938 356 933 369 932 377L931 385L934 380C942 368 941 368 1064 341C1177 316 1238 302 1237 301C1236 301 1220 297 1200 292Z',
      'M1005 418C999 418 979 417 962 416C944 414 929 414 928 413C922 412 913 415 909 419C904 422 903 427 897 451C893 466 887 486 885 496C882 505 871 551 859 597C847 643 837 683 836 685C832 700 824 733 824 734C824 735 824 736 824 737C823 738 818 758 812 781C806 804 801 825 800 826C797 838 791 863 792 864C792 864 801 862 811 859C852 846 875 839 907 829C945 817 951 814 960 805C972 793 974 785 982 713C983 700 991 638 993 625C993 620 994 614 994 613C994 612 995 605 996 597C997 590 998 583 998 583C998 582 1000 565 1002 545C1005 525 1007 508 1007 507C1007 506 1009 492 1011 475C1013 458 1015 444 1015 443C1015 442 1015 437 1016 431C1017 425 1017 420 1017 420C1016 419 1011 419 1005 418Z',
      'M649 654C647 654 624 654 596 655C553 655 542 655 537 656C537 656 532 656 527 656C515 656 516 655 500 656C492 656 485 656 483 656C447 656 443 657 440 661C438 663 424 682 409 702C394 722 380 740 379 741C378 743 376 745 376 746C376 747 247 920 236 933C234 935 222 952 209 969C196 987 183 1004 180 1008C177 1012 171 1020 166 1027C156 1040 156 1041 138 1064C131 1074 125 1082 125 1082C126 1083 181 1072 201 1068C206 1067 210 1066 210 1066C211 1066 216 1065 223 1064C236 1061 238 1061 249 1059C253 1058 273 1054 293 1050C375 1035 444 1021 447 1021C449 1021 455 1019 461 1018C467 1017 494 1012 520 1007C546 1002 572 997 578 996C584 994 589 993 589 993C590 993 595 993 601 991C607 990 617 988 624 987C631 985 640 984 643 983C646 982 649 982 650 982C650 982 653 981 657 981C660 980 670 978 678 977C686 975 698 973 703 972C708 970 713 970 714 970C714 970 719 969 725 968C731 966 751 962 769 959C799 953 802 952 802 949C803 947 802 945 802 945C801 944 800 943 800 942C801 941 799 937 798 933C796 929 795 925 795 924C795 924 793 918 791 913C789 907 787 902 787 901C787 901 777 870 770 851C767 844 755 807 737 753C719 701 717 695 712 687C706 678 696 669 686 663C680 660 655 654 649 654Z',
      'M374 658C368 658 336 658 302 659C248 660 233 660 221 660C220 660 207 660 192 660C177 661 163 661 161 661C160 661 144 661 127 661C102 662 96 662 97 664C98 666 108 677 163 736C177 750 197 772 209 785C221 798 232 809 234 811C235 812 238 815 240 817C245 823 248 825 251 824C253 824 259 818 265 810C271 802 282 788 290 778C298 768 309 754 315 746C321 739 331 726 338 718C344 709 353 698 357 693C362 687 369 677 375 671C380 664 384 658 384 658C383 658 379 658 374 658Z',
      'M730 1030C722 1030 713 1031 711 1031C709 1031 704 1032 698 1032C693 1032 680 1033 670 1034C660 1034 647 1035 642 1035C638 1036 624 1036 613 1037C601 1038 588 1039 583 1039C577 1039 571 1040 568 1040C565 1040 559 1041 554 1041C549 1041 538 1042 530 1042C521 1043 511 1044 507 1044C504 1044 493 1045 484 1045C467 1046 462 1048 462 1053C462 1055 471 1069 482 1084C493 1099 507 1118 513 1126C546 1173 568 1203 569 1203C570 1204 574 1200 579 1196C593 1182 613 1162 623 1152C628 1147 639 1136 648 1128C657 1119 668 1109 673 1104C678 1099 687 1090 693 1084C699 1078 704 1073 705 1073C705 1072 725 1052 741 1037C745 1033 748 1030 748 1030C748 1029 745 1029 730 1030Z',
    ],
    [
      'M1110 296C1070 281 1035 268 1030 266C1026 264 1005 256 1001 254C999 254 982 248 965 241C914 223 915 222 880 275C869 291 862 301 855 312C843 330 836 341 834 350L832 357L836 352C845 342 844 342 970 328C1085 316 1146 310 1146 309C1145 309 1129 303 1110 296Z',
      'M915 352C909 353 890 357 873 360C855 364 840 367 840 367C833 367 825 372 822 377C819 381 819 386 819 411C819 427 819 448 819 457C819 467 819 514 820 562C820 609 820 651 820 653C820 669 820 702 821 703C821 704 821 705 821 706C821 707 821 728 821 752C821 776 821 797 821 799C821 811 821 836 822 837C823 837 831 833 840 827C876 804 896 791 925 774C958 753 964 748 970 737C978 723 978 714 968 643C966 630 958 568 956 555C955 550 955 544 954 543C954 542 953 535 952 527C951 520 950 513 950 513C950 512 947 495 945 475C942 455 940 438 939 437C939 436 937 422 935 405C933 388 931 374 931 373C931 373 930 367 929 361C928 356 927 351 927 350C926 350 921 351 915 352Z',
      'M685 613C683 613 660 611 632 608C590 603 578 602 574 602C574 602 569 601 564 600C551 599 553 599 537 597C529 597 522 596 520 596C484 591 480 591 476 595C474 597 458 614 441 632C424 651 408 667 407 668C405 669 404 671 403 672C402 673 253 829 241 841C239 843 225 858 210 874C195 889 180 905 177 909C173 912 166 920 160 926C149 938 149 938 128 959C120 968 113 975 114 976C114 976 170 973 190 971C195 970 200 970 200 970C200 970 206 970 212 969C226 968 228 968 239 967C243 967 263 966 284 964C367 958 437 954 440 954C442 954 449 953 455 953C461 952 488 950 514 948C541 947 568 945 574 944C580 944 585 943 585 943C586 944 591 943 597 943C603 942 614 941 621 941C628 941 636 940 640 940C643 939 646 939 646 939C647 939 650 939 653 939C657 939 667 938 675 937C684 937 695 936 700 935C706 935 711 935 711 935C712 935 717 935 723 934C729 933 749 932 767 931C798 929 801 928 802 925C802 923 802 921 801 920C801 920 800 919 801 918C801 917 800 913 799 908C798 904 797 900 797 899C797 899 796 893 795 887C793 881 792 876 792 876C792 875 786 843 781 824C780 816 772 778 761 723C749 668 748 663 743 653C739 644 729 634 721 627C715 623 691 614 685 613Z',
      'M402 617C396 616 365 610 331 604C278 594 263 591 252 589C250 589 237 586 223 584C208 581 195 579 193 578C191 578 176 575 159 572C135 567 128 567 129 568C130 571 138 583 180 652C190 668 206 694 215 709C225 724 233 738 234 739C235 741 237 744 239 747C243 753 245 756 249 756C250 756 258 751 265 745C272 738 286 726 296 718C306 710 320 699 327 692C334 686 347 675 355 669C363 662 374 653 379 648C384 644 394 635 400 630C407 624 412 620 412 619C411 619 407 618 402 617Z',
      'M784 942C776 944 768 946 766 947C764 947 758 949 753 950C748 951 736 955 726 957C716 960 704 963 699 964C694 966 682 969 670 972C659 975 646 979 641 980C636 981 630 983 627 984C624 984 618 986 614 987C609 988 598 991 590 994C582 996 572 998 568 999C565 1000 554 1003 545 1005C529 1010 525 1013 526 1018C526 1019 538 1031 552 1044C566 1057 583 1072 590 1079C631 1118 659 1144 660 1144C661 1144 665 1140 669 1134C680 1118 696 1095 703 1083C707 1077 716 1064 723 1054C730 1044 739 1031 742 1026C746 1020 753 1010 758 1003C763 995 767 989 767 989C768 988 784 965 796 947C799 943 802 939 802 938C802 937 799 938 784 942Z',
    ],
  ],
}

const S = {
  Canvas: styled.canvas`
    position: absolute;
    top: 5rem;
    width: 100vw;
    height: calc(100vh - 5rem);
  `,

  Progress: styled.pre`
    position: absolute;
    right: 8vmin;
    top: 8vmin;
    font-size: 1.5rem;
  `,

  NotFound: styled.div`
    h1 {
      color: var(--cl-primary);
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(calc(-50% - 2.5rem));
      font-size: 5rem;
    }
  `,
}
