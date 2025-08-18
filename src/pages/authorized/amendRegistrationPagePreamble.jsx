import { Text } from "@chakra-ui/react";

export default function AmendRegistrationPagePreamble({ entityName }) {
  return (
      <ul style={{ marginLeft: '2em' }}>
          <li style={{ marginBottom: '8px' }}>
              <Text>
                  You can amend the registration for <b>{entityName}</b> by changing its
                  representative(s), or modifying the entity name.
              </Text>
          </li>
          <li style={{ marginBottom: '8px' }}>
              <Text>
                  An Authorized Individual may amend the entity registration by:<br />
                  <ul style={{ marginLeft: '2em' }}>
                      <li style={{ marginBottom: '3px' }}><Text>
                          correcting or updating their entity’s name (as long as the change is <b>not</b> a 
                          substitution of a different entity for an already Registered Entity or for an 
                          entity that has been invited to register to use ETT); 
                      </Text></li>
                  </ul>
              </Text>
          </li>
          <li style={{ marginBottom: '8px' }}>
              <Text>
                  An Authorized Individual may remove any of the Registered Entity’s representatives, 
                  including themself and invite a successor to register.
              </Text>
              <ul style={{ marginLeft: '2em' }}>
                  <li style={{ marginBottom: '3px' }}><Text>
                      If a representative is removed, the entity will remain registered and can continue to 
                      use ETT for 30 days with the vacancy.
                  </Text></li>
                  <li style={{ marginBottom: '3px' }}><Text>
                      If the vacancy is not filled—with the successor representative registering by the 
                      end of that 30 day period—the entity’s ETT registration will end.
                      <ul style={{ marginLeft: '2em' }}>
                          <li style={{ marginBottom: '3px' }}><Text>
                              However, if a Disclosure Request has been initiated during the 30 day period, 
                              ETT will complete the process for that pending Request by sending reminders 
                              even after the 30 day period.
                          </Text></li>
                          <li style={{ marginBottom: '3px' }}><Text>
                              An entity whose registration was ended for failure to timely register a 
                              successor to a removed representative may register anew if desired.  To do so, 
                              it will need to identify its three representatives (two Authorized Individuals 
                              and Administrative Support Professional).
                          </Text></li>
                      </ul>
                  </Text></li>
                  <li style={{ marginBottom: '3px' }}><Text>
                      Once identified (whether at the time of removal or within the 30 day period after 
                      removal), an Authorized Individual may invite the successor to register.  ETT will 
                      issue an email to that person to register with a special link. But that person will 
                      need to complete their registration by the end of the same 30 day period.
                  </Text></li>
              </ul>
          </li>
      </ul>
    
  )
}