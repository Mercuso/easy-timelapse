;AFTER_LAYER_CHANGE
G1 X5 Y180 F{travel_speed*60} ;Move away from the print
G4 S0 ;Wait for move to finish
G4 P500 ;Wait for 500 ms
PHOTO ;Raise unknown command error to catch this moment
G4 P500 ;Wait for 500 ms
;[layer_z]
