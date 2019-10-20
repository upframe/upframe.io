import React,{useEffect,useState}  from 'react';
import Api from '../../utils/Api'

import styles from './index.module.scss'


const MENTOR_URL="https://upframe.io/"


const MentorAvatar = (props) =>{
    if(props.mentor){
        return(
            <div className={styles.mentorWrapper}>
                <a href={MENTOR_URL+props.mentor.keycode} className={styles.mentorContent}>
                    <img src={props.mentor.profilePic} alt={props.mentor.name} />
                    <div className={styles.mentorText}>
                        <h2>{props.mentor.name}</h2>
                        <h3>{props.mentor.role} at {props.mentor.company} </h3>
                    </div>
                </a>
            </div>
        )}
    return 'loading'
}

const Recommendation = (props) =>{

    const [mentorsList,setMentorsList] = useState([])
  
    const apiCall = (mentorKeycode) => {
        return Api.getMentorInfo(mentorKeycode).then((res) => {
            let data = [res.mentor]
            return data
        })
    }
      
    useEffect(() => {
    const promises = props.recommendations.map((mentorPromise) => {
        return apiCall(mentorPromise)
    })

     Promise.all(promises).then((result) => {
        let list = result[0].concat(result[1])
        setMentorsList(list)
     })
    }
        ,[props.recommendations]);
    
    const mentorComponent = mentorsList.map((mentor,key) => {
        return <MentorAvatar mentor={mentor} key={key}/>
    })
    
    return(
        <section className={styles.cardWrapper}>
            <h2>Other mentors who can help</h2>
            <div className={styles.recommenderWrapper}> 
                {mentorComponent}
            </div>
        </section>
    )
}

export default Recommendation;