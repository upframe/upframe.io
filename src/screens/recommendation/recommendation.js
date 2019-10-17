import React,{useEffect,useState}  from 'react';
import Api from '../../utils/Api'

import styles from './recommendation.module.scss'


const MENTOR_URL="https://upframe.io/"


const MentorAvatar = (props) =>{

    console.log(props[0], 'from mentor ')
    if(props[0]){
        return(
            <div className={styles.mentorWrapper}>
                <a href={MENTOR_URL+props[0].keycode} className={styles.mentorContent}>
                    <img src={props[0].profilePic} alt={props[0].name} />
                    <div className={styles.mentorText}>
                        <h2>{props[0].name}</h2>
                        <h3>{props[0].role} at {props[0].company} </h3>
                    </div>
                </a>
            </div>
        )}
    return 'loading'
}

const Recommendation = (props) =>{
    
    const [firstMentor,setFirstMentor] = useState()
    const [secondMentor,setSecondMentor] = useState()
    const mentorList = [setFirstMentor,setSecondMentor]

    const apiCall = (mentorKeycode,mentorName) => {
        Api.getMentorInfo(mentorKeycode).then((res) => {
            let data = [res.mentor] 
            mentorName(data)
        })
    }
    useEffect(() => {
        Object.entries(props).map((mentor,key) => {
            apiCall(mentor[1],mentorList[key])
        })
    }
        ,[]);
    return(
        <section className={styles.cardWrapper}>
            <h2>Other mentors who can help</h2>
            <div className={styles.recommenderWrapper}> 
                <MentorAvatar {...firstMentor}/>
                <MentorAvatar {...secondMentor}/>
            </div>
        </section>
    )
}

export default Recommendation;