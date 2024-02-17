import { FC, PropsWithChildren } from 'react'
import cl from './messagePrototype.module.scss'
import { IChatMessageProps } from '@/models/IMessage'
import { CheckReadSvg, CheckSendSvg, MessageVectorSvg } from '@/components/svgs'

const MessagePrototype: FC<PropsWithChildren<IChatMessageProps>> = ({ isMyMessage, time, vectorCondition, children, isRead, type, message }) => {

  const mainRightStyles = vectorCondition ? `${cl.message} ${cl.right} ${cl.border__right}` : `${cl.message} ${cl.right}`
  const mainLeftStyles = vectorCondition ? `${cl.message} ${cl.left} ${cl.border__left}` : `${cl.message} ${cl.left}`

  const messageClasses = isMyMessage ? mainRightStyles : mainLeftStyles;
  const messageTextStyles = isMyMessage ? cl.border__left : cl.border__right

  const messageInfo = (
    <>
      <div className={type === 'image' && !message ? `${cl.message__info} ${cl.image}` : cl.message__info}>
        {time}
        {isMyMessage ? isRead ? <CheckReadSvg /> : <CheckSendSvg /> : null}
      </div>
      {vectorCondition && (
        <div className={`${cl.message__vector} ${isMyMessage ? cl.right : cl.left}`}>
          <MessageVectorSvg />
        </div>
      )}
    </>
  )
  const messageContent = (
    <>
      {children}
      {messageInfo}
    </>
  );

  return (
    <div className={`${messageClasses} ${type === 'image' ? cl.padding : ''}`}>
      {type === 'image' && message ? (
        <div className={cl.message__image__content}>
          {/* {messageContent} */}
          {children}
          <div className={
            vectorCondition ? `${cl.message__image__text} ${messageTextStyles}` : cl.message__image__text
          }>{message}{messageInfo}</div>
        </div>
      ) : (
        messageContent
      )}
    </div>
  );

  // return (
  //   <>
  //     {isMyMessage ? <div className={type === 'image' ? `${mainRightStyles} ${cl.padding}` : mainRightStyles}>
  //       {message ?
  //         type === 'image' ? <>
  //           <div className={cl.message__image__content}>
  //             {children}
  //             <div className={cl.message__image__text}>
  //               {message}
  //               <div className={cl.message__info}>
  //                 {time}
  //                 {isRead ?
  //                   <CheckReadSvg />
  //                   :
  //                   <CheckSendSvg />
  //                 }
  //               </div>
  //               {vectorCondition && <div className={`${cl.message__vector} ${cl.right}`}>
  //                 <MessageVectorSvg />
  //               </div>
  //               }
  //             </div>
  //           </div>
  //         </> :
  //           <>
  //             {children}
  //             <div className={cl.message__info}>
  //               {time}
  //               {isRead ?
  //                 <CheckReadSvg />
  //                 :
  //                 <CheckSendSvg />
  //               }
  //             </div>
  //             {vectorCondition && <div className={`${cl.message__vector} ${cl.right}`}>
  //               <MessageVectorSvg />
  //             </div>
  //             }
  //           </> : type === 'image' ? children : <>
  //             {children}
  //             <div className={cl.message__info}>
  //               {time}
  //               {isRead ?
  //                 <CheckReadSvg />
  //                 :
  //                 <CheckSendSvg />
  //               }
  //             </div>
  //             {vectorCondition && <div className={`${cl.message__vector} ${cl.right}`}>
  //               <MessageVectorSvg />
  //             </div>
  //             }
  //           </>
  //       }
  //     </div> :
  //       <div className={type === 'image' ? `${mainLeftStyles} ${cl.padding}` : mainLeftStyles}>{children}
  //         {type !== 'image' && <>
  //           <div className={cl.message__info}>{time}</div>
  //           {vectorCondition && <div className={`${cl.message__vector} ${cl.left}`}>
  //             <MessageVectorSvg />
  //           </div>}
  //         </>
  //         }
  //       </div>
  //     }
  //   </>
  //   // <>
  //   //   {isMyMessage ? <div className={type === 'image' ? `${mainRightStyles} ${cl.padding}` : mainRightStyles}>{children}
  //   //     {type !== 'image' &&
  //   //       <>
  //   //         <div className={cl.message__info}>
  //   //           {time}
  //   //           {isRead ?
  //   //             <CheckReadSvg />
  //   //             :
  //   //             <CheckSendSvg />
  //   //           }
  //   //         </div>
  //   //         {vectorCondition && <div className={`${cl.message__vector} ${cl.right}`}>
  //   //           <MessageVectorSvg />
  //   //         </div>
  //   //         }
  //   //       </>
  //   //     }
  //   //   </div> :
  //   //     <div className={type === 'image' ? `${mainLeftStyles} ${cl.padding}` : mainLeftStyles}>{children}
  //   //       {type !== 'image' && <>
  //   //         <div className={cl.message__info}>{time}</div>
  //   //         {vectorCondition && <div className={`${cl.message__vector} ${cl.left}`}>
  //   //           <MessageVectorSvg />
  //   //         </div>}
  //   //       </>
  //   //       }
  //   //     </div>
  //   //   }
  //   // </>
  //   // <>
  //   //   {isMyMessage ? <div className={type === 'image' ? `${mainRightStyles} ${cl.padding}` : mainRightStyles}>{children}
  //   //     {message &&
  //   //       <>
  //   //         <div className={cl.message__info}>
  //   //           {time}
  //   //           {isRead ?
  //   //             <CheckReadSvg />
  //   //             :
  //   //             <CheckSendSvg />
  //   //           }
  //   //         </div>
  //   //         {vectorCondition && <div className={`${cl.message__vector} ${cl.right}`}>
  //   //           <MessageVectorSvg />
  //   //         </div>
  //   //         }
  //   //       </>
  //   //     }
  //   //   </div> :
  //   //     <div className={type === 'image' ? `${mainLeftStyles} ${cl.padding}` : mainLeftStyles}>{children}
  //   //       {message && <>
  //   //         <div className={cl.message__info}>{time}</div>
  //   //         {vectorCondition && <div className={`${cl.message__vector} ${cl.left}`}>
  //   //           <MessageVectorSvg />
  //   //         </div>}
  //   //       </>
  //   //       }
  //   //     </div>
  //   //   }
  //   // </>
  // )
}

export default MessagePrototype